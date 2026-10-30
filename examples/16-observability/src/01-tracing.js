import { createLab, runActivity } from './lab.js'

// 注册观测配置后，通过真实工作流生成并查询一条执行记录。
const lab = await createLab()
try {
  const { result, runId } = await runActivity(lab)
  console.log('运行标识：', runId)
  console.log('追踪标识：', result.traceId)
  const trace = await lab.store.getTrace({ traceId: result.traceId })
  console.table(trace.spans.map(span => ({
    name: span.name, spanId: span.spanId, parentSpanId: span.parentSpanId,
    startedAt: span.startedAt, endedAt: span.endedAt
  })))
} finally {
  await lab.mastra.shutdown()
}
