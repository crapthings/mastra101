import { Agent } from '@mastra/core/agent'
import { Mastra } from '@mastra/core'
import { createTool } from '@mastra/core/tools'
import { LibSQLStore } from '@mastra/libsql'
import { z } from 'zod'
import { writeFile } from 'node:fs/promises'
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'

// 只在明确批准后保存本地提醒草稿，不发送通知或修改真实预约。
const saveReminder = createTool({
  id: 'save-reminder-draft',
  description: '保存一份本地教学提醒草稿，不发送提醒。',
  inputSchema: z.object({ text: z.string().min(1).max(200) }),
  outputSchema: z.object({ status: z.literal('草稿已保存'), file: z.string() }),
  requireApproval: true,
  execute: async ({ text }) => {
    await writeFile('reminder-draft.json', JSON.stringify({ text, source: '教学示例' }, null, 2))
    return { status: '草稿已保存', file: 'reminder-draft.json' }
  }
})

// 配置申请保存草稿的助手，拒绝后不再申请同一动作。
const configuredAgent = new Agent({
  id: 'activity-approval',
  name: '提醒草稿助手',
  model: 'vercel/openai/gpt-6.1-sol',
  instructions: '用中文回答。按用户提供的内容保存一次草稿。被拒绝后说明未保存，不再次申请。不要声称已发送提醒。',
  tools: { saveReminder }
})

// 存储用于保存暂停快照，与是否配置对话记忆是两回事。
const mastra = new Mastra({
  agents: { configuredAgent },
  storage: new LibSQLStore({ id: 'approval-storage', url: 'file:./approval.db' })
})

// 从实例取得 Agent，使本次运行能使用实例的存储。
const agent = mastra.getAgentById('activity-approval')
// 创建一次待批准的任务，先检查返回的暂停状态。
const pending = await agent.generate('保存提醒草稿：周六出发前核对预约状态。', {
  maxSteps: 3,
  abortSignal: AbortSignal.timeout(60_000)
})

if (pending.finishReason === 'suspended' && pending.suspendPayload) {
  console.log('待确认的工具与参数：')
  console.dir(pending.suspendPayload, { depth: null })
  const terminal = createInterface({ input: stdin, output: stdout })
  let decision
  try {
    decision = await terminal.question('将写入或覆盖本目录的 reminder-draft.json。输入“确认”批准，其他输入拒绝：')
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
    : await agent.declineToolCallGenerate({ ...options, reason: '用户没有确认保存草稿。' })
  console.log('恢复后的结束原因：', result.finishReason)
  console.log(result.text || '没有最终文本，请核对运行状态。')
} else {
  console.log('没有进入预期的审批暂停，请检查实际结果：')
  console.dir({ finishReason: pending.finishReason, text: pending.text }, { depth: null })
}
