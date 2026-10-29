import { Agent } from '@mastra/core/agent'
import { createReservationTool } from './reservation.js'

// 每次只检查一种教学场景，以保留清楚的输入与结果对应关系。
const mode = process.argv[2] || '正常'
// 将步骤记录留在本次任务中，便于核对参数、业务状态与最终回答。
const steps = []

// 使用与工具循环相同的任务要求，避免比较时同时更换多个条件。
const agent = new Agent({
  id: 'activity-review',
  name: '活动查询复盘助手',
  model: 'vercel/openai/gpt-6.1-sol',
  instructions: '用中文回答。先查 lookupReservation，原样使用用户编号。保留返回状态和教学数据来源，不重复查询，不声称执行了预约操作。',
  tools: { lookupReservation: createReservationTool(mode) }
})

// 收集本次调用的证据，输出记录而不自动宣称测试通过。
const result = await agent.generate('请查询预约编号 R001。', {
  maxSteps: 3,
  abortSignal: AbortSignal.timeout(60_000),
  onStepFinish: ({ toolCalls, toolResults, finishReason }) => {
    steps.push({ toolCalls, toolResults, finishReason })
  }
})

console.dir({
  scenario: mode,
  steps,
  final: { text: result.text, finishReason: result.finishReason },
  usage: result.usage
}, { depth: null })
