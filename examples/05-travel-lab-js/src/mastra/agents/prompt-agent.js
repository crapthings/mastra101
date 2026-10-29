import { Agent } from '@mastra/core/agent'

// 用最小配置提供独立的模型与提示词实验入口。
export const promptAgent = new Agent({
  id: 'prompt-lab',
  name: '提示词实验助手',
  instructions: '用中文回答。',
  model: 'vercel/openai/gpt-6.1-sol'
})
