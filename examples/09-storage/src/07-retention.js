import { LibSQLStore } from '@mastra/libsql'
import { Memory } from '@mastra/memory'
import { randomUUID } from 'node:crypto'

// 只在本节专用教学数据库里设置消息保留策略。
const storage = new LibSQLStore({
  id: 'retention-storage', url: 'file:./07-retention.db',
  retention: { memory: { messages: { maxAge: '30d' } } }
})
// 本例不启用向量、工作记忆和观察记忆，便于单独检查消息清理。
const memory = new Memory({ storage, options: { semanticRecall: false, generateTitle: false } })
// 每次运行新建会话，清理前后只检查本次准备的消息。
const thread = await memory.createThread({ threadId: randomUUID(), resourceId: 'demo-reader', title: '消息保留期练习' })
// 准备一条过期资料与一条仍在保留期内的资料。
const dates = [new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), new Date()]
await memory.saveMessages({ messages: dates.map((date, index) => ({
  id: randomUUID(), threadId: thread.id, resourceId: 'demo-reader', role: 'user', createdAt: date,
  content: { format: 2, parts: [{ type: 'text', text: index === 0 ? '旧教学资料：活动待确认。' : '新教学资料：主办方刚刚更正入口。' }] }
})) })
console.log('清理前消息数：', (await memory.recall({ threadId: thread.id, perPage: false })).messages.length)
// retention 声明策略，prune 才执行；生产中由独立维护任务按计划调用。
const result = await storage.prune({ maxRows: 100, maxBatches: 10 })
console.dir(result, { depth: null })
console.log('清理后消息数：', (await memory.recall({ threadId: thread.id, perPage: false })).messages.length)
console.log('会话仍然存在：', Boolean(await memory.getThreadById({ threadId: thread.id })))
