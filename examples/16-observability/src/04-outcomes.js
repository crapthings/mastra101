import { createLab, runActivity } from './lab.js'

// 对比正常返回、业务资料缺失和执行异常，不用一个“成功”概括三者。
const lab = await createLab()
try {
  for (const mode of ['ok', 'missing', 'error']) {
    const { result } = await runActivity(lab, { mode })
    const trace = await lab.store.getTrace({ traceId: result.traceId })
    console.log('模式：', mode, '工作流状态：', result.status)
    console.table(trace.spans.map(span => ({
      type: span.spanType, ended: Boolean(span.endedAt),
      outcome: span.outcome, status: span.attributes?.status,
      error: Boolean(span.error), output: JSON.stringify(span.output)
    })))
  }
} finally {
  await lab.mastra.shutdown()
}
