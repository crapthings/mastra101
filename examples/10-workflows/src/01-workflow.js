import { createStep, createWorkflow } from '@mastra/core/workflows'
import { z } from 'zod'

// 工作流输入只接受已有活动资料，不负责从外部查询事实。
const activitySchema = z.object({ title: z.string().min(1), venue: z.string().min(1) })
// 最终交付物是一个有明确字段的准备清单。
const checklistSchema = z.object({ title: z.string(), items: z.array(z.string()) })
// 一个步骤完成一项具体转换，不调用模型。
const prepare = createStep({
  id: 'prepare-checklist', inputSchema: activitySchema, outputSchema: checklistSchema,
  execute: async ({ inputData }) => ({ title: inputData.title, items: [`核对入场地点：${inputData.venue}`, '带好预约码'] })
})
// 先定义流程，再提交定义；此处尚未运行。
const workflow = createWorkflow({ id: 'first-activity-workflow', inputSchema: activitySchema, outputSchema: checklistSchema })
  .then(prepare)
  .commit()
// 每次 createRun 创建一次新的运行。
const run = await workflow.createRun()
// start 才把本次资料送入定义好的流程。
const result = await run.start({ inputData: { title: '阅读分享会', venue: '南门' } })
console.log('运行标识：', run.runId)
console.dir(result, { depth: null })
