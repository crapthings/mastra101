import { createLab, runActivity } from './lab.js'

// 使用框架自动记录的工作流耗时计算本次实验的样本数与平均值。
const lab = await createLab()
try {
  const start = new Date()
  for (const delayMs of [5, 15, 40]) await runActivity(lab, { delayMs })
  const filters = { timestamp: { start, end: new Date() } }
  for (const aggregation of ['count', 'avg', 'max']) {
    const value = await lab.store.getMetricAggregate({ name: ['mastra_workflow_duration_ms'], aggregation, filters })
    console.log(aggregation, value.value)
  }
  const page = await lab.store.listMetrics({ filters: { ...filters, name: ['mastra_workflow_duration_ms'] } })
  console.table(page.metrics.map(metric => ({
    name: metric.name, value: metric.value,
    traceId: metric.traceId, spanId: metric.spanId
  })))
} finally {
  await lab.mastra.shutdown()
}
