import { Agent } from '@mastra/core/agent'

// 使用固定模型建立本章的输入实验基线。
export const travelAgent = new Agent({
  id: 'travel-materials',
  name: '出行资料助手',
  instructions: '用中文回答。',
  model: 'vercel/openai/gpt-6.1-sol'
})
