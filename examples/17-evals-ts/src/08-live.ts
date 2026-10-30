import { createLab } from './lab.ts'
import { samples } from './samples.ts'

// 将评分器接到步骤后，运行与评分会通过框架的后台机制分别完成。
const mastra = createLab({ live: true })
try {
  const run = await mastra.getWorkflow('revised').createRun()
  const result = await run.start({ inputData: samples[2].input })
  console.log('工作流状态：', result.status)
  const scores = await mastra.getStorage().getStore('scores')
  let page
  for (let attempt = 0; attempt < 50; attempt++) {
    page = await scores.listScoresByRunId({ runId: run.runId, pagination: { page: 0, perPage: 10 } })
    if (page.scores.length > 0) break
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  if (!page.scores.length) throw new Error('等待评分结果超时，请检查后台评分与存储配置')
  console.table(page.scores.map(score => ({ scorerId: score.scorerId, score: score.score, reason: score.reason })))
} finally {
  await mastra.shutdown()
}
