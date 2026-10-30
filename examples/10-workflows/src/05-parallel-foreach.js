import { createStep, createWorkflow } from '@mastra/core/workflows'
import { z } from 'zod'

// 两项独立检查读取同一份活动资料。
const activitySchema = z.object({ title: z.string(), venue: z.string() })
// 第一个步骤整理入场提示。
const entrance = createStep({
  id: 'entrance', inputSchema: activitySchema, outputSchema: z.object({ notice: z.string() }),
  execute: async ({ inputData }) => ({ notice: `从${inputData.venue}入场` })
})
// 第二个步骤整理固定的教学携带要求。
const materials = createStep({
  id: 'materials', inputSchema: activitySchema, outputSchema: z.object({ items: z.array(z.string()) }),
  execute: async () => ({ items: ['预约码', '纸质笔记本'] })
})
// 合并步骤按上游步骤 id 读取各自结果。
const merge = createStep({
  id: 'merge', inputSchema: z.object({ entrance: z.object({ notice: z.string() }), materials: z.object({ items: z.array(z.string()) }) }),
  outputSchema: z.array(z.string()),
  execute: async ({ inputData }) => [inputData.entrance.notice, ...inputData.materials.items]
})
// parallel 组织不同工作，都完成后才进入合并步骤。
const parallelWorkflow = createWorkflow({ id: 'activity-parallel', inputSchema: activitySchema, outputSchema: z.array(z.string()) })
  .parallel([entrance, materials]).then(merge).commit()
// foreach 使用同一种处理处理数组里的每一项。
const item = createStep({
  id: 'prepare-item', inputSchema: z.string(), outputSchema: z.string(),
  execute: async ({ inputData }) => `出发前核对：${inputData}`
})
// 数组处理完成后，交付全部结果与数量。
const summarize = createStep({
  id: 'summarize', inputSchema: z.array(z.string()), outputSchema: z.object({ items: z.array(z.string()), count: z.number() }),
  execute: async ({ inputData }) => ({ items: inputData, count: inputData.length })
})
// 显式限制并发项数，实际项目可据接口或模型服务能力调整。
const foreachWorkflow = createWorkflow({ id: 'activity-foreach', inputSchema: z.array(z.string()), outputSchema: z.object({ items: z.array(z.string()), count: z.number() }) })
  .foreach(item, { concurrency: 2 }).then(summarize).commit()
// 先执行独立检查，取得数组后再执行逐项处理。
const firstRun = await parallelWorkflow.createRun()
// 只有第一份流程成功，才把其产物交给第二份流程。
const first = await firstRun.start({ inputData: { title: '阅读分享会', venue: '南门' } })
console.dir(first, { depth: null })
if (first.status === 'success') {
  const secondRun = await foreachWorkflow.createRun()
  console.dir(await secondRun.start({ inputData: first.result }), { depth: null })
}
