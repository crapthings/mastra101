import { Agent } from '@mastra/core/agent'
import { Memory } from '@mastra/memory'
import { LibSQLStore } from '@mastra/libsql'
import { randomUUID } from 'node:crypto'

// 显式指定观察模型，较长对话达到条件后整理成观察记录。
const memory = new Memory({
  storage: new LibSQLStore({ id: 'observation-storage', url: 'file:./07-observational.db' }),
  options: {
    semanticRecall: false, generateTitle: false,
    observationalMemory: {
      model: 'vercel/openai/gpt-6.1-sol',
      observation: { messageTokens: 1000, bufferTokens: false }
    }
  }
})

// 活动助手读取可用上下文，观察过程由记忆配置安排。
const agent = new Agent({
  id: 'activity-observation', name: '活动资料助手', model: 'vercel/openai/gpt-6.1-sol', memory,
  instructions: '用中文核对资料，保留更新顺序和来源。后续明确更正应覆盖旧安排，未知信息仍待确认。'
})

// 此短对话只跑通配置，达到阈值的长对话才会触发观察。
const identity = { resource: randomUUID(), thread: randomUUID() }
await agent.generate('主办方原先通知东门入场，刚刚更正为南门入场。请以更正通知为准。', {
  memory: identity, maxSteps: 1, abortSignal: AbortSignal.timeout(60_000)
})
// 核对更正是否保留，不能仅凭回答正确就断定观察已经发生。
const result = await agent.generate('现在应该走哪个入口？', {
  memory: identity, maxSteps: 1, abortSignal: AbortSignal.timeout(60_000)
})
console.log(result.text)
console.log('观察阈值为 1000 Token；请在长对话中结合调用记录检查是否实际触发。')
