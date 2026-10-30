import { createScorer, notScorable } from '@mastra/core/evals'
import { z } from 'zod'

// 参考资料必须包含可核对的状态、入口和来源。
const referenceSchema = z.object({ status: z.enum(['已确认', '待确认']), venue: z.string().nullable(), source: z.string().min(1) })

// 核对通知结构中的状态、入口和来源，缺少参考资料时不强行打分。
export const evidenceScorer = createScorer({
  id: 'notice-evidence', name: '通知依据一致性',
  description: '逐字段比较状态、入口和来源，资料缺失时应保留待确认'
})
  .preprocess(({ run }) => {
    const notice = run.input?.notice
    if (!run.groundTruth && !notice) return notScorable('没有可供核对的参考资料')
    const expected = run.groundTruth ?? {
      status: notice.venue === null ? '待确认' : '已确认', venue: notice.venue, source: notice.source
    }
    const parsed = referenceSchema.safeParse(expected)
    if (!parsed.success) return notScorable('参考资料格式不完整')
    return { expected: parsed.data, actual: run.output }
  })
  .generateScore(({ results }) => {
    const { expected, actual } = results.preprocessStepResult
    return ['status', 'venue', 'source'].every(key => actual?.[key] === expected[key]) ? 1 : 0
  })
  .generateReason(({ results, score }) => score === 1
    ? '状态、入口和来源均与参考资料一致'
    : `应返回：${JSON.stringify(results.preprocessStepResult.expected)}；实际返回：${JSON.stringify(results.preprocessStepResult.actual)}`)
