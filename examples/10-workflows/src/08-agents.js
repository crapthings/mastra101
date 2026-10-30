import { createStep, createWorkflow } from '@mastra/core/workflows'
import { z } from 'zod'
import { Agent } from '@mastra/core/agent'

// 程序只接受已经提供的活动标题、地点与携带要求。
const factsSchema = z.object({ title: z.string().min(1), venue: z.string().min(1), materials: z.array(z.string()).min(1) })
// Agent 需要交付结构化草稿，供后续程序检查。
const draftSchema = z.object({ title: z.string(), venue: z.string(), items: z.array(z.string()).min(1) })
// 最终业务状态仍然是待用户确认。
const deliverySchema = draftSchema.extend({ status: z.literal('待用户确认') })
// 系统提示词只约束生成职责，流程顺序由工作流决定。
const agent = new Agent({
  id: 'workflow-draft-agent', name: '活动清单整理助手', model: 'vercel/openai/gpt-6.1-sol',
  instructions: '用中文整理出发准备清单。仅依据已核对资料，原样保留标题和地点；不增添未提供的规定，不声称已经保存或发送。'
})
// 先做确定性的资料检查，再允许调用模型。
const verify = createStep({
  id: 'verify-facts', inputSchema: factsSchema, outputSchema: factsSchema,
  execute: async ({ inputData }) => factsSchema.parse(inputData)
})
// 模型只负责这一步文字组织，返回值必须符合交接结构。
const draft = createStep({
  id: 'draft-with-agent', inputSchema: factsSchema, outputSchema: draftSchema,
  execute: async ({ inputData, abortSignal }) => {
    const result = await agent.generate(`根据以下已核对资料整理清单：${JSON.stringify(inputData)}`, {
      maxSteps: 1, structuredOutput: { schema: draftSchema, errorStrategy: 'strict' },
      abortSignal: abortSignal ? AbortSignal.any([abortSignal, AbortSignal.timeout(60_000)]) : AbortSignal.timeout(60_000)
    })
    return draftSchema.parse(result.object)
  }
})
// 用前面步骤的事实核对关键字段，再交付待确认草稿。
const review = createStep({
  id: 'review-draft', inputSchema: draftSchema, outputSchema: deliverySchema,
  execute: async ({ inputData, getStepResult }) => {
    const facts = getStepResult(verify)
    if (inputData.title !== facts.title || inputData.venue !== facts.venue) throw new Error('草稿改变了已核对的活动标题或地点。')
    return { ...inputData, status: '待用户确认' }
  }
})
// Agent 嵌在程序定义的流程里，生成以后仍经过检查。
const workflow = createWorkflow({ id: 'activity-with-agent', inputSchema: factsSchema, outputSchema: deliverySchema })
  .then(verify).then(draft).then(review).commit()
// 此入口会发起真实模型请求，不保存或发送清单。
const run = await workflow.createRun()
// 工作流本身接收业务输入，模型调用的等待上限在步骤内设置。
const result = await run.start({
  inputData: { title: '阅读分享会', venue: '南门', materials: ['预约码', '纸质笔记本'] }
})
console.dir(result, { depth: null })
