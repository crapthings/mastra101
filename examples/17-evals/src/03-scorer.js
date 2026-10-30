import { evidenceScorer } from './scorer.js'
import { samples } from './samples.js'

// 用相同参考资料核对不同输出，观察分数、理由和无法评分的情况。
const sample = samples[2]
for (const output of [sample.groundTruth, { status: '已确认', venue: '南门', source: '场馆通知' }]) {
  const result = await evidenceScorer.run({ ...sample, output })
  console.log('分数：', result.score, '理由：', result.reason)
}
// 缺少参考资料不能作为零分或满分计入平均值。
const skipped = await evidenceScorer.run({ output: { status: '待确认', venue: null, source: null } })
console.log('无法评分：', skipped.notScorable)
