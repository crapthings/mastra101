import { Agent } from '@mastra/core/agent'
import { createCodeMode, createTool } from '@mastra/core/tools'
import { QuickJsCodeModeTransport } from '@mastra/quickjs'
import { z } from 'zod'

// 提供不含个人信息的教学报名状态，仅供统计。
const listRegistrations = createTool({
  id: 'list-registrations',
  description: '读取本地教学报名列表。',
  inputSchema: z.object({}),
  outputSchema: z.object({ statuses: z.array(z.enum(['有效', '已取消'])) }),
  execute: async () => ({ statuses: ['有效', '有效', '已取消'] })
})

// 提供同一活动的教学容量，不访问真实服务。
const getCapacity = createTool({
  id: 'get-capacity',
  description: '读取教学活动的总容量。',
  inputSchema: z.object({}),
  outputSchema: z.object({ capacity: z.number().int().nonnegative() }),
  execute: async () => ({ capacity: 20 })
})

// 用 QuickJS 隔离模型生成的编排代码，只桥接上面两个只读工具。
const { tool, instructions } = createCodeMode(
  { tools: { listRegistrations, getCapacity } },
  new QuickJsCodeModeTransport({ memoryLimitMb: 128 })
)

// 同时挂载 Code Mode 工具与它生成的使用说明。
const agent = new Agent({
  id: 'activity-code-mode',
  name: '活动名额统计助手',
  model: 'vercel/openai/gpt-6.1-sol',
  instructions: ['用中文回答。调用工具统计教学数据，只计算有效报名，不把已取消记录计入。', instructions],
  tools: { execute_typescript: tool }
})

// 观察编排工具的输入输出，并用人工可核对的小数据检查算术。
const result = await agent.generate('读取报名列表和容量，计算有效报名人数与剩余名额。', {
  maxSteps: 3,
  abortSignal: AbortSignal.timeout(60_000),
  onStepFinish: ({ toolCalls, toolResults }) => console.dir({ toolCalls, toolResults }, { depth: null })
})

console.log(result.text || '没有最终文本，请查看工具执行结果。')
