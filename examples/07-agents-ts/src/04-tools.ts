import { Agent } from '@mastra/core/agent'
import { createTool } from '@mastra/core/tools'
import { z } from 'zod'

// 选择可重复观察的教学场景，不访问真实预约系统。
const demoMode = z.enum(['正常', '未查到', '失败']).parse(process.argv[2] || '正常')

// 提供只读查询，并区分查到记录、没有匹配记录和查询失败。
const lookupReservation = createTool({
  id: 'lookup-reservation',
  description: '按预约编号查询教学预约记录，不创建或修改预约。',
  inputSchema: z.object({
    bookingId: z.string().min(1).describe('用户提供的预约编号，例如 R001')
  }),
  outputSchema: z.object({
    bookingId: z.string(),
    status: z.enum(['已预约', '未查到', '查询失败']),
    detail: z.string(),
    source: z.string()
  }),
  execute: async ({ bookingId }) => {
    const base = { bookingId, source: '本地教学数据，不是真实预约记录' }
    if (demoMode === '失败') {
      return { ...base, status: '查询失败', detail: '模拟预约服务暂时不可用。' }
    }
    if (demoMode === '未查到' || bookingId !== 'R001') {
      return { ...base, status: '未查到', detail: '教学数据中没有这个编号的记录。' }
    }
    return { ...base, status: '已预约', detail: '阅读分享会，周六下午两点开始，预约人数为 1 人。' }
  }
})

// 让活动助手根据工具返回的状态回答，不把查询说成办理预约。
const activityAgent = new Agent({
  id: 'activity-guide-tools',
  name: '活动预约查询助手',
  instructions: `
    用中文回答。查询预约状态时，先调用 lookupReservation。
    原样使用用户提供的预约编号；缺少编号时先询问，不自行编造。
    依据工具返回的 status、detail 和 source 回答，明确这是教学数据。
    未查到记录时，请用户核对编号；查询失败时，说明状态尚未确认。
    本次运行不要用相同参数反复查询，不声称创建、修改或取消了预约。
  `,
  model: 'vercel/openai/gpt-6.1-sol',
  tools: { lookupReservation }
})

// 选择当前请求是否允许工具调用，工具范围仍由应用明确指定。
const toolChoice = z.enum(['auto', 'none']).parse(process.argv[3] || 'auto')

// 发起一次查询，打印各步记录以区分模型请求和工具执行结果。
const result = await activityAgent.generate('请查一下预约编号 R001 的状态。', {
  maxSteps: 3,
  activeTools: ['lookupReservation'],
  toolChoice,
  abortSignal: AbortSignal.timeout(60_000),
  onStepFinish: ({ toolCalls, toolResults, finishReason }) => {
    console.dir({ toolCalls, toolResults, finishReason }, { depth: null })
  }
})

console.log('最终回答：')
console.log(result.text || '没有最终文本，请查看执行记录。')
