import { MCPClient } from '@mastra/mcp'
import { Agent } from '@mastra/core/agent'
import { Mastra } from '@mastra/core'
import { LibSQLStore } from '@mastra/libsql'
import { fileURLToPath } from 'node:url'

// 命令行明确决定是否批准一次本地教学草稿写入。
const decision = process.argv[2] || '拒绝'
if (!['确认', '拒绝'].includes(decision)) throw new Error('请使用“确认”或“拒绝”。')
// 保存工具需要审批，查询和状态读取保持只读路径。
const client = new MCPClient({
  id: 'activity-approval-client',
  servers: {
    activity: {
      command: process.execPath, args: [fileURLToPath(new URL('./stdio-server.ts', import.meta.url))],
      requireToolApproval: ({ toolName }) => toolName === 'saveDraft'
    }
  }
})
try {
  const tools = await client.listTools()
  const configured = new Agent({
    id: 'connected-assistant', name: '外部草稿助手', model: 'vercel/openai/gpt-6.1-sol',
    instructions: '仅保存一次用户提供的草稿。被拒绝后说明未保存，不再次申请，不声称已发送通知。', tools
  })
  const mastra = new Mastra({ agents: { configured }, storage: new LibSQLStore({ id: 'mcp-approval', url: 'file:./06-approval.db' }) })
  const agent = mastra.getAgentById('connected-assistant')
  const pending = await agent.generate('保存教学草稿：周六出发前核对个人预约状态。', { maxSteps: 2, abortSignal: AbortSignal.timeout(60000) })
  console.dir({ 暂停原因: pending.finishReason, 待确认动作: pending.suspendPayload }, { depth: 5 })
  console.dir({ 批准前数量: await tools.activity_draftStatus.execute({}) })
  if (pending.finishReason !== 'suspended' || !pending.suspendPayload) throw new Error('没有进入预期审批，请核对实际调用。')
  const options = { runId: pending.runId, toolCallId: pending.suspendPayload.toolCallId, maxSteps: 2, abortSignal: AbortSignal.timeout(60000) }
  const result = decision === '确认'
    ? await agent.approveToolCallGenerate(options)
    : await agent.declineToolCallGenerate({ ...options, reason: '本次明确拒绝教学草稿写入。' })
  console.dir({ text: result.text, finishReason: result.finishReason, toolResults: result.toolResults, 审批后数量: await tools.activity_draftStatus.execute({}) }, { depth: 5 })
} finally {
  await client.disconnect()
}
