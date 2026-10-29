import { Mastra } from '@mastra/core/mastra'
import { travelAgent } from './agents/travel-agent.ts'
import { promptAgent } from './agents/prompt-agent.ts'

// 分别注册自由实验与资料核对用的 Agent，供 Studio 选择。
export const mastra = new Mastra({
  agents: { promptAgent, travelAgent }
})
