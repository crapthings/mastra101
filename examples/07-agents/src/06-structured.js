import { Agent } from '@mastra/core/agent'
import { z } from 'zod'
import { createReservationTool } from './reservation.js'

// 约定最终交接对象的字段，明确保留未查到和查询失败两种状态。
const answerSchema = z.object({
  bookingId: z.string(),
  status: z.enum(['已预约', '未查到', '查询失败']),
  summary: z.string(),
  source: z.string(),
  missing: z.array(z.string())
})

// 让助手先读取教学查询结果，再整理为可供程序处理的对象。
const agent = new Agent({
  id: 'activity-structured',
  name: '活动结果整理助手',
  instructions: '用中文回答。先调用 lookupReservation，原样保留编号、状态和来源。未明确的信息放入 missing；不要把未查到或查询失败改成没有预约。只查一次。',
  model: 'vercel/openai/gpt-6.1-sol',
  tools: { lookupReservation: createReservationTool(process.argv[2] || '正常') }
})

try {
  const result = await agent.generate('查询预约编号 R001，并整理结果。', {
    maxSteps: 3,
    abortSignal: AbortSignal.timeout(60_000),
    structuredOutput: { schema: answerSchema, errorStrategy: 'strict' },
    onStepFinish: ({ toolResults }) => console.dir({ toolResults }, { depth: null })
  })
  const answer = answerSchema.parse(result.object)
  console.log('结构符合约定，继续对照工具结果核对内容：')
  console.dir(answer, { depth: null })
} catch (error) {
  console.error('没有得到可用的结构化结果：', error instanceof Error ? error.message : error)
  process.exitCode = 1
}
