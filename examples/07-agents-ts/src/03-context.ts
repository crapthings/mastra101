import { Agent } from '@mastra/core/agent'
import { RequestContext } from '@mastra/core/request-context'
import { z } from 'zod'

// 按应用传入的展示偏好生成本次指令，不把上下文对象全部发送给模型。
const agent = new Agent({
  id: 'activity-context',
  name: '活动资料助手',
  model: 'vercel/openai/gpt-6.1-sol',
  requestContextSchema: z.object({ detail: z.enum(['简短', '详细']) }),
  instructions: ({ requestContext }) => {
    const detail = requestContext.get('detail')
    return `用中文核对材料，保留缺失信息。本次采用${detail}的表达；不要补写预约结果。`
  }
})

// 每次任务创建独立的请求上下文，由应用确定这些值。
const requestContext = new RequestContext()
requestContext.set('detail', process.argv[2] || '简短')

// 本次材料与任务仍由用户消息提供，不混入应用配置字段。
const result = await agent.generate('活动周六下午两点开始，地点待定。请整理已知与待确认信息。', {
  requestContext,
  maxSteps: 1,
  abortSignal: AbortSignal.timeout(60_000)
})

console.log(result.text || '本次没有最终文本。')
