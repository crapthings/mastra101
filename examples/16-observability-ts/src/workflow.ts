import { createStep, createWorkflow } from '@mastra/core/workflows'
import { z } from 'zod'

// 创建一个可控制等待与业务结果的固定活动核对流程。
export function createActivityWorkflow () {
  const schema = z.object({ venue: z.string(), delayMs: z.number(), mode: z.enum(['ok', 'missing', 'error']) })
  const lookup = createStep({
    id: 'lookup-notice', inputSchema: schema,
    outputSchema: z.object({ status: z.string(), venue: z.string() }),
    execute: async ({ inputData, mastra }) => {
      mastra.getLogger().info('开始核对活动通知', { venue: inputData.venue })
      await new Promise(resolve => setTimeout(resolve, inputData.delayMs))
      if (inputData.mode === 'error') throw new Error('模拟通知服务暂时不可用')
      return { status: inputData.mode === 'missing' ? '未找到通知' : '已确认', venue: inputData.venue }
    }
  })
  return createWorkflow({ id: 'activity-check', inputSchema: schema, outputSchema: lookup.outputSchema })
    .then(lookup).commit()
}
