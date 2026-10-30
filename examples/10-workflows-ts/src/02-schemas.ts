import { createStep, createWorkflow } from '@mastra/core/workflows'
import { z } from 'zod'

// 标题、地点与人数都有各自的结构和约束。
const activitySchema = z.object({ title: z.string().min(1), venue: z.string().min(1), attendees: z.number().int().positive() })
// 整理后的对象需要保留人数，并提供可读说明。
const preparedSchema = activitySchema.extend({ summary: z.string() })
// 选择正常输入、缺少必需字段或步骤生成错误值的路径。
const mode = z.enum(['正常', '缺少标题', '错误人数']).parse(process.argv[2] || '正常')
// 显式校验步骤产物，让外部数据或自定义转换的错误停在交接处。
const prepare = createStep({
  id: 'validate-prepared', inputSchema: activitySchema, outputSchema: preparedSchema,
  execute: async ({ inputData }) => preparedSchema.parse({
    ...inputData, attendees: mode === '错误人数' ? 0 : inputData.attendees,
    summary: `${inputData.title}，从${inputData.venue}入场。`
  })
})
// 输入校验显式开启，避免学习时把类型声明当成运行结果。
const workflow = createWorkflow({
  id: 'activity-schema-contract', inputSchema: activitySchema, outputSchema: preparedSchema,
  options: { validateInputs: true }
}).then(prepare).commit()
// 三种路径使用相同流程定义，只改变输入或教学错误条件。
const run = await workflow.createRun()
try {
  const result = await run.start({ inputData: { title: mode === '缺少标题' ? '' : '阅读分享会', venue: '南门', attendees: 1 } })
  console.dir(result, { depth: null })
} catch (error) {
  console.error('运行入口校验未通过：', error instanceof Error ? error.message : error)
}
