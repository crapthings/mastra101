import { createStep, createWorkflow } from '@mastra/core/workflows'
import { z } from 'zod'

// 地点可以缺失，让流程显式决定走哪条业务路径。
const activitySchema = z.object({ title: z.string().min(1), venue: z.string().optional() })
// 两条路径各自产出同样的业务结果结构。
const decisionSchema = z.object({ status: z.enum(['可准备', '待补充']), items: z.array(z.string()) })
// 完整资料进入清单准备路径。
const ready = createStep({
  id: 'ready', inputSchema: activitySchema, outputSchema: decisionSchema,
  execute: async ({ inputData }) => ({ status: '可准备', items: [`核对入场地点：${inputData.venue}`, '带好预约码'] })
})
// 缺少地点时返回明确缺口，正常结束这次判断。
const missing = createStep({
  id: 'missing', inputSchema: activitySchema, outputSchema: decisionSchema,
  execute: async () => ({ status: '待补充', items: ['请补充主办方确认的入场地点'] })
})
// 两个条件互斥，后续 map 把按步骤 id 分组的结果转换成统一结构。
const workflow = createWorkflow({ id: 'activity-branching', inputSchema: activitySchema, outputSchema: decisionSchema })
  .branch([
    [async ({ inputData }) => Boolean(inputData.venue?.trim()), ready],
    [async ({ inputData }) => !inputData.venue?.trim(), missing]
  ])
  .map(async ({ inputData }) => decisionSchema.parse(inputData.ready || inputData.missing))
  .commit()
// 仅改变资料是否齐全，不改分支定义。
const mode = z.enum(['完整', '缺少地点']).parse(process.argv[2] || '完整')
// 每次启动一份新的判断流程。
const run = await workflow.createRun()
console.dir(await run.start({ inputData: { title: '阅读分享会', ...(mode === '完整' ? { venue: '南门' } : {}) } }), { depth: null })
