import { createLab, runActivity } from './lab.js'

// 用业务请求标识关联执行记录，而不是把完整用户资料放进元数据。
const lab = await createLab()
try {
  const { result, runId } = await runActivity(lab, {
    requestId: 'activity-query-001',
    tracingOptions: { tags: ['活动查询'], metadata: { channel: '网页' } }
  })
  const trace = await lab.store.getTrace({ traceId: result.traceId })
  console.log('运行标识：', runId, '追踪标识：', result.traceId)
  console.table(trace.spans.map(span => ({
    spanId: span.spanId, requestId: span.requestId,
    metadata: JSON.stringify(span.metadata), tags: span.tags
  })))
} finally {
  await lab.mastra.shutdown()
}
