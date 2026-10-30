import { Agent } from '@mastra/core/agent'
import { Memory } from '@mastra/memory'
import { LibSQLStore } from '@mastra/libsql'
import { randomUUID } from 'node:crypto'

// 用提示 Token 预算控制历史窗口，较早的记录仍保存在数据库里。
const memory = new Memory({
  storage: new LibSQLStore({ id: 'context-storage', url: 'file:./06-context.db' }),
  options: {
    semanticRecall: false, generateTitle: false,
    messageHistory: { maxTokens: 4000, atMaxRemoveTokens: 1000 }
  }
})

// 系统规则和当前任务也占上下文，应用需要为这些内容保留空间。
const agent = new Agent({
  id: 'activity-context-budget', name: '活动资料助手', model: 'vercel/openai/gpt-6.1-sol', memory,
  instructions: '用中文核对活动材料，缺少依据时请用户补充，不从片段推断已经预约。'
})

// 小材料用于跑通配置，不代表两次调用一定触发裁剪。
const identity = { resource: randomUUID(), thread: randomUUID() }
await agent.generate('阅读分享会周六两点开始，东门入场。', { memory: identity, maxSteps: 1, abortSignal: AbortSignal.timeout(60_000) })
// 查看用量与结果，较长会话需要再对照模型实际输入确认裁剪效果。
const result = await agent.generate('帮我整理一下安排。', { memory: identity, maxSteps: 1, abortSignal: AbortSignal.timeout(60_000) })
console.dir({ text: result.text, usage: result.usage }, { depth: null })
