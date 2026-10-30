import { Agent } from '@mastra/core/agent'
import { Memory } from '@mastra/memory'
import { LibSQLStore } from '@mastra/libsql'
import { randomUUID } from 'node:crypto'

// 比较两条与八条历史消息，参数不代表对话轮数。
const lastMessages = Number(process.argv[2] || '2')
if (![2, 8].includes(lastMessages)) throw new Error('请使用 2 或 8。')

// 消息窗口改变加载范围，已经保存的消息仍在数据库里。
const memory = new Memory({
  storage: new LibSQLStore({ id: 'history-storage', url: 'file:./03-history.db' }),
  options: { lastMessages, semanticRecall: false, generateTitle: false }
})

// 前两次只确认收到，避免主动复述全部活动资料。
const agent = new Agent({
  id: 'activity-history', name: '活动资料助手', model: 'vercel/openai/gpt-6.1-sol', memory,
  instructions: '用中文回答。收到资料补充时只回复“收到”。用户提问时只依据当前可见资料回答，没有依据就说明未知。'
})

// 同一会话依次收到入场资料、携带要求与最后的问题。
const identity = { resource: randomUUID(), thread: randomUUID() }
for (const message of ['资料补充：阅读分享会从东门入场。', '资料补充：参加时带纸质笔记本。', '阅读分享会从哪个门入场，要带什么？']) {
  const result = await agent.generate(message, { memory: identity, maxSteps: 1, abortSignal: AbortSignal.timeout(60_000) })
  console.log(result.text)
}

// 读取完整存储用于对照，不把存储条数当成模型实际看到的条数。
const saved = await memory.recall({ threadId: identity.thread, resourceId: identity.resource, perPage: false })
console.log('数据库中保留的消息数：', saved.messages.length)
