import { createLab } from './lab.ts'
import { samples } from './samples.ts'

// 锁定同一数据集版本，以相同评分器比较两个已注册工作流。
const mastra = createLab()
try {
  const dataset = await mastra.datasets.create({ name: '通知版本比较' })
  await dataset.addItems({ items: samples })
  const { version } = await dataset.getDetails()
  for (const targetId of ['notice-baseline', 'notice-revised']) {
    const summary = await dataset.startExperiment({
      name: targetId, targetType: 'workflow', targetId,
      version, scorers: ['notice-evidence']
    })
    console.log('目标：', targetId, '状态：', summary.status, '执行成功：', summary.succeededCount, '执行失败：', summary.failedCount)
    console.table(summary.results.map(item => ({
      expected: JSON.stringify(item.groundTruth), actual: JSON.stringify(item.output),
      score: item.scores[0]?.score, reason: item.scores[0]?.reason
    })))
  }
} finally {
  await mastra.shutdown()
}
