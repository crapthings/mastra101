import { Agent } from '@mastra/core/agent'
import { getCurrentTime } from '../tools/time-tool.ts'

// 为时间助手提供真实查询能力，并约定失败时应怎样回答。
export const timeAgent = new Agent({
  id: 'time-guide',
  name: '旅行时间助手',
  instructions: `
    用中文回答。询问当前时间时，先调用 getCurrentTime，再依据结果回答。
    用户给出了明确时区时，原样传给工具；没有明确时区时先询问。
    不要自行修正用户提供的时区。
    工具返回 ok: false 时，解释失败并请求有效时区，不要编造时间或反复调用相同参数。
    回答成功结果时，包含时区与取样时间，并说明这是查询时刻的时间。
  `,
  model: 'vercel/openai/gpt-6.1-sol',
  tools: { getCurrentTime }
})
