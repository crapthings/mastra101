import { createStep, createWorkflow } from '@mastra/core/workflows'
import { z } from 'zod'

// 三种教学路径分别观察有限重试、持续失败与业务提前结束。
const mode = z.enum(['暂时失败', '持续失败', '待补充']).parse(process.argv[2] || '暂时失败')
// 计数只用于观察本进程的步骤执行，不是持久化业务状态。
let attempts = 0
// 核对最终步骤是否实际执行，避免仅根据流程状态猜测。
let finalized = false
// 业务结果保留待补充含义。
const outcomeSchema = z.object({ status: z.enum(['已核对', '待补充']), detail: z.string() })
// 对只读教学查询设置一次重试，异常时重新执行这一步。
const inspect = createStep({
  id: 'inspect-material', inputSchema: z.object({ title: z.string() }), outputSchema: outcomeSchema, retries: 1,
  execute: async ({ bail }) => {
    attempts++
    if (mode === '待补充') return bail({ status: '待补充', detail: '请补充活动地点。' })
    if (mode === '持续失败' || attempts === 1) throw new Error('教学资料查询暂时失败。')
    return { status: '已核对', detail: '教学资料查询成功。' }
  }
})
// 只有查询步骤正常交接，才运行这里。
const finalize = createStep({
  id: 'finalize', inputSchema: outcomeSchema, outputSchema: outcomeSchema,
  execute: async ({ inputData }) => { finalized = true; return inputData }
})
// 整体默认不额外重试，明确观察 inspect 的步骤级预算。
const workflow = createWorkflow({ id: 'activity-errors', inputSchema: z.object({ title: z.string() }), outputSchema: outcomeSchema, retryConfig: { attempts: 0, delay: 0 } })
  .then(inspect).then(finalize).commit()
// 根据状态读取结果或错误，同时保留各步骤证据。
const run = await workflow.createRun()
// start 返回后先看 status，再解释业务字段。
const result = await run.start({ inputData: { title: '阅读分享会' } })
console.dir({ result, attempts, finalized }, { depth: null })
