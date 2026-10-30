import { createStep, createWorkflow } from '@mastra/core/workflows'
import { z } from 'zod'

// 资料核对步骤接收原标题与地点。
const activitySchema = z.object({ title: z.string().min(1), venue: z.string().min(1) })
// 清单制作步骤使用自己的字段名，交接处需要映射。
const listInputSchema = z.object({ heading: z.string(), entrance: z.string() })
// 清单内容保持结构化，方便后续交付。
const checklistSchema = z.object({ heading: z.string(), items: z.array(z.string()) })
// 最终产物明确仍待用户确认。
const deliverySchema = z.object({ title: z.string(), items: z.array(z.string()), status: z.literal('待用户确认') })
// 先完成确定性的空白清理与字段校验。
const normalize = createStep({
  id: 'normalize-material', inputSchema: activitySchema, outputSchema: activitySchema,
  execute: async ({ inputData }) => activitySchema.parse({ title: inputData.title.trim(), venue: inputData.venue.trim() })
})
// 根据核对后的地点制作清单。
const prepare = createStep({
  id: 'make-checklist', inputSchema: listInputSchema, outputSchema: checklistSchema,
  execute: async ({ inputData }) => ({ heading: inputData.heading, items: [`从${inputData.entrance}入场`, '带好预约码'] })
})
// 把步骤结果包装成可供界面展示的待确认产物。
const deliver = createStep({
  id: 'deliver-checklist', inputSchema: checklistSchema, outputSchema: deliverySchema,
  execute: async ({ inputData }) => ({ title: inputData.heading, items: inputData.items, status: '待用户确认' })
})
// map 在两步之间转换数据形状，then 按顺序连接步骤。
const workflow = createWorkflow({ id: 'activity-sequence', inputSchema: activitySchema, outputSchema: deliverySchema })
  .then(normalize)
  .map(async ({ inputData }) => ({ heading: inputData.title, entrance: inputData.venue }))
  .then(prepare)
  .then(deliver)
  .commit()
// 这次运行只生成待确认清单，没有保存或发送。
const run = await workflow.createRun()
console.dir(await run.start({ inputData: { title: ' 阅读分享会 ', venue: ' 南门 ' } }), { depth: null })
