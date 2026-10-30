import { registerApiRoute } from '@mastra/core/server'
import { z } from 'zod'
import { createCancellationRoute } from './cancellation-route.js'

// 三条业务路由分别演示健康响应、输入校验与可取消的等待任务。
export function createRoutes (state) {
  const schema = z.object({ venue: z.string().min(1).nullable() })
  return [
    registerApiRoute('/health', {
      method: 'GET', handler: async c => c.json({ status: '服务可响应' })
    }),
    registerApiRoute('/notice-preview', {
      method: 'POST', handler: async c => {
        let body
        try { body = await c.req.json() } catch { return c.json({ error: '请求体必须是 JSON' }, 400) }
        const parsed = schema.safeParse(body)
        if (!parsed.success) return c.json({ error: 'venue 必须是非空文字或 null' }, 400)
        const run = await c.get('mastra').getWorkflow('noticeCheck').createRun()
        const result = await run.start({ inputData: parsed.data, requestContext: c.get('requestContext') })
        return c.json({ runId: run.runId, status: result.status, result: result.status === 'success' ? result.result : null })
      }
    }),
    createCancellationRoute(state)
  ]
}
