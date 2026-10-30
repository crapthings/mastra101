import { createLab, runActivity } from './lab.js'

// 从耗时指标定位最慢样本，再沿追踪标识查询步骤和日志。
const lab = await createLab()
try {
  const start = new Date()
  for (const delayMs of [5, 15, 120]) await runActivity(lab, { delayMs })
  const page = await lab.store.listMetrics({ filters: {
    name: ['mastra_workflow_duration_ms'], timestamp: { start, end: new Date() }
  } })
  const slowest = page.metrics.reduce((a, b) => a.value > b.value ? a : b)
  const trace = await lab.store.getTrace({ traceId: slowest.traceId })
  const logs = await lab.store.listLogs({ filters: { traceId: slowest.traceId } })
  console.log('最慢样本：', slowest.value, '毫秒', slowest.traceId)
  console.table(trace.spans.map(span => ({
    name: span.name, parentSpanId: span.parentSpanId,
    durationMs: span.endedAt ? span.endedAt - span.startedAt : null
  })))
  console.table(logs.logs.map(log => ({
    message: log.message, spanId: log.spanId
  })))
} finally {
  await lab.mastra.shutdown()
}
