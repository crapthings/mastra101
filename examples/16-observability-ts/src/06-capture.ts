import { createLab, runActivity } from './lab.ts'

// 隐藏输入输出后检查实际落库内容，元数据只使用虚构资料。
const lab = await createLab()
try {
  const { result } = await runActivity(lab, { tracingOptions: {
    hideInput: true, hideOutput: true,
    metadata: { password: '演示口令', note: '演示备注，不含个人资料' }
  } })
  const trace = await lab.store.getTrace({ traceId: result.traceId })
  console.table(trace.spans.map(span => ({
    type: span.spanType, input: span.input, output: span.output,
    metadata: JSON.stringify(span.metadata)
  })))
} finally {
  await lab.mastra.shutdown()
}
