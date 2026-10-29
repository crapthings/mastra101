import { Agent } from '@mastra/core/agent'
import { z } from 'zod'

// 校验本次请求的输出预算，便于固定其他条件进行比较。
const maxOutputTokens = z.coerce.number().int().min(64).max(1200).parse(process.argv[2] || '400')

// 为重复调用提供默认生成设置，调用时仍可覆盖相应字段。
const agent = new Agent({
  id: 'activity-model-settings',
  name: '活动资料助手',
  model: 'vercel/openai/gpt-6.1-sol',
  instructions: '用中文整理活动材料，分开列出已知信息与待确认事项，不补写事实。',
  defaultOptions: { modelSettings: { maxOutputTokens: 600 } }
})

// 只改变本次输出预算，不同时更换模型、材料或指令。
const result = await agent.generate('周六下午两点活动开始，一点半开放入场，需要预约，地点待定。请说明已知信息和待确认事项。', {
  maxSteps: 1,
  modelSettings: { maxOutputTokens },
  abortSignal: AbortSignal.timeout(60_000)
})

console.dir({ text: result.text, finishReason: result.finishReason, usage: result.usage }, { depth: null })
