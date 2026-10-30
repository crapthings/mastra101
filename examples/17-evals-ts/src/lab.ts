import { Mastra } from '@mastra/core/mastra'
import { createStep, createWorkflow } from '@mastra/core/workflows'
import { LibSQLStore } from '@mastra/libsql'
import { z } from 'zod'
import { evidenceScorer } from './scorer.ts'

// 两个固定版本只在资料缺失时的处理不同，用于观察真实评估 API 的结果。
export function createLab ({ live = false } = {}) {
  const inputSchema = z.object({ notice: z.object({ venue: z.string().nullable(), source: z.string() }) })
  const outputSchema = z.object({ status: z.string(), venue: z.string().nullable(), source: z.string() })
  const workflows = {}
  for (const version of ['baseline', 'revised']) {
    const prepare = createStep({
      id: `prepare-${version}`, inputSchema, outputSchema,
      ...(live ? { scorers: { evidence: { scorer: evidenceScorer, sampling: { type: 'ratio', rate: 1 } } } } : {}),
      execute: async ({ inputData }) => {
        const { notice } = inputData
        return {
          status: version === 'revised' && notice.venue === null ? '待确认' : '已确认',
          venue: version === 'baseline' ? notice.venue ?? '南门' : notice.venue,
          source: notice.source
        }
      }
    })
    workflows[version] = createWorkflow({ id: `notice-${version}`, inputSchema, outputSchema })
      .then(prepare).commit()
  }
  return new Mastra({
    workflows, scorers: { evidence: evidenceScorer },
    storage: new LibSQLStore({ id: 'eval-storage', url: ':memory:' })
  })
}
