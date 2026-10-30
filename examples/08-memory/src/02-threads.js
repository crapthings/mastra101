import { Memory } from '@mastra/memory'
import { LibSQLStore } from '@mastra/libsql'
import { randomUUID } from 'node:crypto'

// 只使用本地存储观察会话归属，不调用模型。
const memory = new Memory({
  storage: new LibSQLStore({ id: 'thread-storage', url: 'file:./02-threads.db' }),
  options: { semanticRecall: false, generateTitle: false }
})

// 两位教学用户有不同归属，同一用户可以拥有多段会话。
const firstReader = `reader-${randomUUID()}`
// 第二位教学用户的标识独立生成。
const secondReader = `reader-${randomUUID()}`
await memory.createThread({ threadId: randomUUID(), resourceId: firstReader, title: '阅读分享会' })
await memory.createThread({ threadId: randomUUID(), resourceId: firstReader, title: '周末展览' })
await memory.createThread({ threadId: randomUUID(), resourceId: secondReader, title: '阅读分享会' })

// 应用用经过确认的归属标识查询会话列表。
const listed = await memory.listThreads({ filter: { resourceId: firstReader }, perPage: false })
console.table(listed.threads.map(thread => ({ 会话: thread.title, 归属: thread.resourceId, 标识: thread.id })))
console.log('这位教学用户应有两段会话：', listed.threads.length)
