import { Memory } from '@mastra/memory'
import { LibSQLStore, LibSQLVector } from '@mastra/libsql'
import { ModelRouterEmbeddingModel } from '@mastra/core/llm'
import { randomUUID } from 'node:crypto'

// 语义召回使用嵌入模型，通过 Vercel 的兼容接口接入。
const embedder = new ModelRouterEmbeddingModel({
  providerId: 'vercel', modelId: 'openai/text-embedding-3-small',
  url: 'https://ai-gateway.vercel.sh/v1', apiKey: process.env.AI_GATEWAY_API_KEY
})

// 数据库存消息，向量索引存检索所需表示，召回范围限定到同一资源。
const memory = new Memory({
  storage: new LibSQLStore({ id: 'recall-storage', url: 'file:./05-recall.db' }),
  vector: new LibSQLVector({ id: 'recall-vector', url: 'file:./05-recall.db' }), embedder,
  options: { lastMessages: 2, generateTitle: false, semanticRecall: { topK: 2, messageRange: 0, scope: 'resource' } }
})

// 为同一教学用户准备一段旧会话和一段新会话。
const resourceId = randomUUID()
// 旧会话存放待检索的资料。
const oldThread = await memory.createThread({ threadId: randomUUID(), resourceId, title: '上次的活动安排' })
// 新会话用于提问，不直接复制旧消息。
const currentThread = await memory.createThread({ threadId: randomUUID(), resourceId, title: '这次的活动提问' })
await memory.saveMessages({ messages: [{
  id: randomUUID(), threadId: oldThread.id, resourceId, role: 'user', createdAt: new Date(),
  content: { format: 2, parts: [{ type: 'text', text: '阅读分享会的参与者统一从东门进入，现场凭预约码核验。' }] }
}] })

// 改用不同措辞检索旧消息，这个脚本不调用聊天模型生成答案。
const recalled = await memory.recall({
  threadId: currentThread.id, resourceId, vectorSearchString: '上次说从哪个入口进场？',
  threadConfig: { semanticRecall: { topK: 2, messageRange: 0, scope: 'resource' } }
})
console.dir(recalled.messages.map(message => ({ threadId: message.threadId, parts: message.content.parts })), { depth: null })
