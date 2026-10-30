import { Agent } from '@mastra/core/agent'
import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import { createLab } from './lab.js'

// 固定通知用于观察工具调用，不连接真实活动服务。
const lookupNotice = createTool({
  id: 'lookup-notice', description: '查询阅读分享会的已发布入场地点',
  inputSchema: z.object({ title: z.string() }),
  execute: async () => ({ status: '已确认', venue: '南门' })
})
// 一次查询通常包含模型、工具和再次生成回答的多个执行片段。
const agent = new Agent({
  id: 'activity-helper', name: '活动助手',
  model: 'vercel/openai/gpt-6.1-sol',
  instructions: '回答入场地点前先查询通知。根据查询结果回答，不补充未提供的信息。',
  tools: { lookupNotice }
})
// 将智能体注册到已有 Mastra 实例，沿用本章的本地观测配置。
const lab = await createLab()
lab.mastra.addAgent(agent, 'activityHelper')
try {
  const result = await lab.mastra.getAgent('activityHelper').generate('阅读分享会从哪个门入场？', { maxSteps: 3 })
  await lab.mastra.observability.flush()
  const trace = await lab.store.getTrace({ traceId: result.traceId })
  console.log('回答：', result.text)
  console.table(trace.spans.map(span => ({
    spanId: span.spanId, parentSpanId: span.parentSpanId,
    type: span.spanType, name: span.name
  })))
} finally {
  await lab.mastra.shutdown()
}
