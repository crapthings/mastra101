import { createStep, createWorkflow, createWorkflowStateReader } from '@mastra/core/workflows'
import { z } from 'zod'
import { Mastra } from '@mastra/core'
import { LibSQLStore } from '@mastra/libsql'
import { readFile, writeFile } from 'node:fs/promises'

// 起始资料允许缺少地点，先通过暂停索取补充。
const initialSchema = z.object({ title: z.string(), venue: z.string().optional() })
// 补充完成后，后续步骤要求地点存在。
const completeSchema = z.object({ title: z.string(), venue: z.string().min(1) })
// 清单在进入确认步骤前就有了明确内容。
const checklistSchema = z.object({ title: z.string(), venue: z.string(), items: z.array(z.string()) })
// 用户决定是交接数据的一部分，false 表示明确拒绝。
const approvedSchema = checklistSchema.extend({ approved: z.boolean() })
// 最终结果如实区分保存与拒绝。
const resultSchema = z.object({ status: z.enum(['已保存', '已拒绝']), file: z.string().nullable() })
// resume 会重新进入此步骤，所以只在这里检查输入与补充数据。
const complete = createStep({
  id: 'complete-details', inputSchema: initialSchema, outputSchema: completeSchema,
  suspendSchema: z.object({ reason: z.string() }), resumeSchema: z.object({ venue: z.string().trim().min(1) }),
  execute: async ({ inputData, resumeData, suspend }) => {
    const venue = resumeData?.venue || inputData.venue
    if (!venue) return await suspend({ reason: '请补充主办方确认的入场地点。' })
    return { title: inputData.title, venue }
  }
})
// 在资料齐全以后才制作清单。
const prepare = createStep({
  id: 'prepare-checklist', inputSchema: completeSchema, outputSchema: checklistSchema,
  execute: async ({ inputData }) => ({ ...inputData, items: [`从${inputData.venue}入场`, '带好预约码'] })
})
// 先暂停展示具体清单，恢复时明确处理批准和拒绝。
const confirm = createStep({
  id: 'confirm-checklist', inputSchema: checklistSchema, outputSchema: approvedSchema,
  suspendSchema: checklistSchema, resumeSchema: z.object({ approved: z.boolean() }),
  execute: async ({ inputData, resumeData, suspend }) => {
    if (!resumeData) return await suspend(inputData)
    return { ...inputData, approved: resumeData.approved }
  }
})
// 仅在明确批准后写入或覆盖本地教学文件。
const save = createStep({
  id: 'save-checklist', inputSchema: approvedSchema, outputSchema: resultSchema,
  execute: async ({ inputData }) => {
    if (!inputData.approved) return { status: '已拒绝', file: null }
    await writeFile('06-confirmed.json', JSON.stringify({ title: inputData.title, venue: inputData.venue, items: inputData.items }, null, 2))
    return { status: '已保存', file: '06-confirmed.json' }
  }
})
// 同一份流程定义用于开始、补充与确认三个独立进程。
const workflow = createWorkflow({ id: 'activity-confirmation', inputSchema: initialSchema, outputSchema: resultSchema })
  .then(complete).then(prepare).then(confirm).then(save).commit()
// 快照写入本节数据库，供另一个进程按 runId 恢复。
const mastra = new Mastra({ workflows: { activity: workflow }, storage: new LibSQLStore({ id: 'workflow-storage', url: 'file:./06-workflows.db' }) })
// 通过实例取得注册的工作流，使存储配置参与运行。
const registered = mastra.getWorkflow('activity')
// 命令参数代表这次用户明确发起的操作。
const mode = z.enum(['开始', '补充', '确认', '拒绝']).parse(process.argv[2] || '开始')
if (mode === '开始') {
  const run = await registered.createRun()
  const result = await run.start({ inputData: { title: '阅读分享会' } })
  if (result.status === 'suspended') await writeFile('06-pending.json', JSON.stringify({ runId: run.runId }))
  console.log('运行标识：', run.runId)
  console.dir(result, { depth: null })
} else {
  const pending = z.object({ runId: z.string().min(1) }).parse(JSON.parse(await readFile('06-pending.json', 'utf8')))
  const stored = await registered.getWorkflowRunById(pending.runId)
  if (stored?.status !== 'suspended') throw new Error('这次运行不在等待恢复，不能重复确认。')
  const suspended = createWorkflowStateReader(stored).getSuspendedStep()
  const expectedStep = mode === '补充' ? 'complete-details' : 'confirm-checklist'
  if (suspended?.stepId !== expectedStep) throw new Error('当前等待的步骤与命令不一致，请先按提示补充或确认。')
  console.log('本次待恢复步骤：', suspended.stepId)
  console.dir(suspended.suspendPayload, { depth: null })
  const run = await registered.createRun({ runId: pending.runId })
  const result = mode === '补充'
    ? await run.resume({ step: 'complete-details', resumeData: { venue: z.string().trim().min(1).parse(process.argv[3]) } })
    : await run.resume({ step: 'confirm-checklist', resumeData: { approved: mode === '确认' } })
  console.dir(result, { depth: null })
}
