import { Agent } from '@mastra/core/agent'
import { Mastra } from '@mastra/core'
import { createTool } from '@mastra/core/tools'
import { LibSQLStore } from '@mastra/libsql'
import { z } from 'zod'
import { writeFile } from 'node:fs/promises'
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import { createReservationTool } from './reservation.js'
import { buildPreparationDraft } from './preparation.js'

// 完成查询、预览与审批保存，任何阶段缺少证据时都不继续写入。
async function main () {
  const lookup = createReservationTool(process.argv[2] || '正常')
  const evidence = []
  const lookupReservation = createTool({
    id: 'lookup-preparation-reservation',
    description: lookup.description,
    inputSchema: lookup.inputSchema,
    outputSchema: lookup.outputSchema,
    execute: async (input, context) => {
      const record = await lookup.execute(input, context)
      evidence.push(record)
      return record
    }
  })
  const reader = new Agent({
    id: 'activity-preparation-reader',
    name: '活动准备助手',
    model: 'vercel/openai/gpt-6.1-sol',
    instructions: '用中文回答。按原编号调用一次 lookupReservation，保留状态与来源。未查到和查询失败都不能说没有预约，不声称完成预约或发送提醒。',
    tools: { lookupReservation }
  })
  const query = await reader.generate('我准备参加阅读分享会，请查询预约编号 R001。', {
    maxSteps: 3,
    abortSignal: AbortSignal.timeout(60_000),
    onStepFinish: ({ toolCalls, toolResults }) => console.dir({ toolCalls, toolResults }, { depth: null })
  })
  console.log('助手回答：', query.text || '没有最终文字，请核对工具记录。')
  if (evidence.length !== 1) throw new Error('预期只有一次实际查询，请检查工具记录后重试。')
  const draft = buildPreparationDraft(evidence[0])
  console.log('\n待保存的完整清单（程序根据教学材料与查询证据生成）：\n')
  console.log(draft)

  const saveDraft = createTool({
    id: 'save-preparation-draft',
    description: '将已展示的准备清单原样写入或覆盖 preparation-draft.md，不发送通知。',
    inputSchema: z.object({}),
    outputSchema: z.object({ file: z.string(), status: z.literal('草稿已保存') }),
    requireApproval: true,
    execute: async () => {
      await writeFile('preparation-draft.md', draft)
      return { file: 'preparation-draft.md', status: '草稿已保存' }
    }
  })
  const writer = new Agent({
    id: 'activity-preparation-writer',
    name: '准备清单保存助手',
    model: 'vercel/openai/gpt-6.1-sol',
    instructions: '调用一次 saveDraft 保存已展示的清单。拒绝后不再申请。只根据工具结果说明保存状态，不声称已发送提醒。',
    tools: { saveDraft }
  })
  const storage = new LibSQLStore({ id: 'preparation-storage', url: 'file:./preparation.db' })
  try {
    const mastra = new Mastra({
      agents: { writer },
      storage
    })
    const agent = mastra.getAgentById('activity-preparation-writer')
    const pending = await agent.generate('请保存刚才展示的准备清单。', {
      maxSteps: 3,
      abortSignal: AbortSignal.timeout(60_000)
    })
    if (pending.finishReason !== 'suspended' || !pending.suspendPayload) {
      console.dir({ finishReason: pending.finishReason, text: pending.text }, { depth: null })
      throw new Error('没有进入审批暂停，请核对本次运行，不能视为已保存。')
    }
    console.log('待审批的工具与参数：')
    console.dir(pending.suspendPayload, { depth: null })
    const terminal = createInterface({ input: stdin, output: stdout })
    let decision
    try {
      decision = await terminal.question('将写入或覆盖 preparation-draft.md。输入“确认”批准，其他输入拒绝：')
    } finally {
      terminal.close()
    }
    const options = {
      runId: pending.runId,
      toolCallId: pending.suspendPayload.toolCallId,
      maxSteps: 3,
      abortSignal: AbortSignal.timeout(60_000)
    }
    const result = decision.trim() === '确认'
      ? await agent.approveToolCallGenerate(options)
      : await agent.declineToolCallGenerate({ ...options, reason: '用户没有确认保存准备清单。' })
    console.dir({ toolResults: result.toolResults, finishReason: result.finishReason, text: result.text }, { depth: null })
  } finally {
    await storage.close()
  }
}

// 输出真实失败原因，避免将未完成的运行展示成成功。
main().catch(error => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
