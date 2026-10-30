import { Agent } from '@mastra/core/agent'
import { Memory } from '@mastra/memory'
import { LibSQLStore } from '@mastra/libsql'
import { randomUUID } from 'node:crypto'

// 将会话历史存入本地数据库，只加载最近八条消息。
const memory = new Memory({
  storage: new LibSQLStore({ id: 'memory-storage', url: 'file:./01-memory.db' }),
  options: { lastMessages: 8, semanticRecall: false, generateTitle: false }
})

// 系统提示词要求依据已提供的信息回答，保留未知项。
const agent = new Agent({
  id: 'activity-memory', name: '活动资料助手',
  model: 'vercel/openai/gpt-6.1-sol',
  instructions: '用中文回答，根据对话中的活动资料作答。资料没有说的就说明未知，不补写预约结果。',
  memory
})

// 两次调用沿用相同的归属与会话标识，每次运行脚本使用新标识。
const identity = { resource: `reader-${randomUUID()}`, thread: `activity-${randomUUID()}` }
console.log(await agent.generate('阅读分享会周六下午两点开始，东门入场。先记下这些资料。', {
  memory: identity, maxSteps: 1, abortSignal: AbortSignal.timeout(60_000)
}).then(result => result.text))
console.log(await agent.generate('那我应该从哪个门进去？', {
  memory: identity, maxSteps: 1, abortSignal: AbortSignal.timeout(60_000)
}).then(result => result.text))

// 回查存储，核对本次对话确实留下了消息。
const saved = await memory.recall({ threadId: identity.thread, resourceId: identity.resource, perPage: false })
console.dir(saved.messages.map(message => ({ role: message.role, parts: message.content.parts })), { depth: null })
