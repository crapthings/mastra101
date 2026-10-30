import { createLab, runActivity } from './lab.js'

// 只查本次追踪中的日志，保留它与具体执行片段的关联。
const lab = await createLab()
try {
  const { result } = await runActivity(lab)
  const page = await lab.store.listLogs({ filters: { traceId: result.traceId } })
  console.table(page.logs.map(log => ({
    level: log.level, message: log.message,
    traceId: log.traceId, spanId: log.spanId
  })))
} finally {
  await lab.mastra.shutdown()
}
