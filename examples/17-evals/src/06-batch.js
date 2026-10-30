import { runEvals } from '@mastra/core/evals'
import { createLab } from './lab.js'
import { evidenceScorer } from './scorer.js'
import { samples } from './samples.js'

// 批量运行基线版本，并保留逐条结果以解释平均分。
const mastra = createLab()
try {
  const result = await runEvals({
    target: mastra.getWorkflow('baseline'), data: samples,
    scorers: [evidenceScorer], concurrency: 1,
    onItemComplete: ({ item, scorerResults }) => {
      const score = scorerResults['notice-evidence']
      console.log('参考：', JSON.stringify(item.groundTruth), '分数：', score.score, '理由：', score.reason)
    }
  })
  console.log('平均分：', result.scores)
  console.log('评估汇总：', result.summary)
} finally {
  await mastra.shutdown()
}
