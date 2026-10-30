import { runEvals } from '@mastra/core/evals'
import { createLab } from './lab.ts'
import { evidenceScorer } from './scorer.ts'
import { samples } from './samples.ts'

// 三种配置分别展示硬性要求失败、均分未达标和全部达标。
const cases = [
  { label: '基线：硬性要求', version: 'baseline', options: { gates: [evidenceScorer] } },
  { label: '基线：均分要求', version: 'baseline', options: { scorers: [{ scorer: evidenceScorer, threshold: 0.9 }] } },
  { label: '修改版：硬性要求', version: 'revised', options: { gates: [evidenceScorer] } }
]
// 注册共享目标，以相同资料运行三种评估配置。
const mastra = createLab()
try {
  for (const item of cases) {
    const result = await runEvals({ target: mastra.getWorkflow(item.version), data: samples, ...item.options })
    console.log(item.label, '判定：', result.verdict)
    console.log('硬性要求：', result.gateResults, '均分要求：', result.thresholdResults)
  }
} finally {
  await mastra.shutdown()
}
