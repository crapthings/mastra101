import { Mastra } from '@mastra/core/mastra'
import { travelAgent } from './agents/travel-agent.js'
import { promptAgent } from './agents/prompt-agent.js'

// 分别注册自由实验与资料核对用的 Agent，供 Studio 选择。
export const mastra = new Mastra({
  agents: { promptAgent, travelAgent }
})
