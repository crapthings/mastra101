import { Agent } from '@mastra/core/agent'
import { Memory } from '@mastra/memory'
import { LibSQLStore } from '@mastra/libsql'
import { randomUUID } from 'node:crypto'

// 以资源为范围维护简短偏好，同一资源的其他会话也可以读取。
const memory = new Memory({
  storage: new LibSQLStore({ id: 'working-storage', url: 'file:./04-working-memory.db' }),
  options: {
    lastMessages: 4, semanticRecall: false, generateTitle: false,
    workingMemory: { enabled: true, scope: 'resource', template: '# 活动偏好\n- 提醒风格：\n- 需要关注的事项：' }
  }
})

// 明确让助手通过记忆工具维护已确认偏好，用户纠正时更新。
const agent = new Agent({
  id: 'activity-working', name: '活动偏好助手', model: 'vercel/openai/gpt-6.1-sol', memory,
  instructions: '用中文回答。用户明确提供或修改长期偏好时，使用工作记忆更新工具保存。只记明确提供的偏好，不把单次活动时间当成永久偏好。'
})

// 两段新会话归属相同，用来区分历史共享和偏好共享。
const resource = randomUUID()
// 第一段会话用于记录偏好。
const firstThread = randomUUID()
await agent.generate('以后活动提醒请简短一点，重点列出入场材料。请保存这个偏好。', {
  memory: { resource, thread: firstThread }, maxSteps: 3, abortSignal: AbortSignal.timeout(60_000)
})
console.log('实际保存的偏好：', await memory.getWorkingMemory({ resourceId: resource, threadId: firstThread }))

// 新会话读取同一资源的工作记忆，不复制上一段完整聊天。
const result = await agent.generate('我希望活动提醒怎样写？', {
  memory: { resource, thread: randomUUID() }, maxSteps: 3, abortSignal: AbortSignal.timeout(60_000)
})
console.log(result.text)
