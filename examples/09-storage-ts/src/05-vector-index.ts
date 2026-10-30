import { Memory } from '@mastra/memory'
import { LibSQLStore, LibSQLVector } from '@mastra/libsql'
import { randomUUID } from 'node:crypto'

// 原始消息通过存储接口保存。
const memory = new Memory({
  storage: new LibSQLStore({ id: 'message-storage', url: 'file:./05-messages.db' }),
  options: { semanticRecall: false, generateTitle: false }
})
// 检索向量通过独立向量接口保存，刻意放进另一文件便于观察职责。
const vector = new LibSQLVector({ id: 'message-vector', url: 'file:./05-vectors.db' })
// 原消息标识用于从检索结果找到对应原文。
const messageId = randomUUID()
// 每次运行只核对这一段教学会话。
const thread = await memory.createThread({ threadId: randomUUID(), resourceId: 'demo-reader', title: '原文与索引' })
await memory.saveMessages({ messages: [{
  id: messageId, threadId: thread.id, resourceId: 'demo-reader', role: 'user', createdAt: new Date(),
  content: { format: 2, parts: [{ type: 'text', text: '阅读分享会从东门入场。' }] }
}] })
await vector.createIndex({ indexName: 'teaching_messages', dimension: 3 })
// 固定三维向量只演示索引读写，不是对中文语义的真实嵌入。
await vector.upsert({
  indexName: 'teaching_messages', ids: [messageId], vectors: [[1, 0, 0]],
  metadata: [{ messageId, threadId: thread.id }]
})
// 查询范围限制为本次会话，不依赖旧试跑留下的向量。
const matches = await vector.query({ indexName: 'teaching_messages', queryVector: [1, 0, 0], topK: 1, filter: { threadId: thread.id } })
// 使用结果中的原消息标识，在会话记录里取回对应文本。
const stored = await memory.recall({ threadId: thread.id, resourceId: 'demo-reader', perPage: false })
console.dir({ matches, original: stored.messages.find(message => message.id === matches[0]?.metadata?.messageId) }, { depth: null })
