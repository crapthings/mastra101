import { setTimeout as delay } from 'node:timers/promises'
import { registerApiRoute } from '@mastra/core/server'

// 把当前 HTTP 请求的取消信号传给等待任务，保留实际执行状态供脚本核对。
export function createCancellationRoute (state) {
  return registerApiRoute('/slow-preview', {
    method: 'POST', handler: async c => {
      state.started = true
      try {
        await delay(1000, undefined, { signal: c.req.raw.signal })
        state.finished = true
        return c.json({ status: '已完成等待' })
      } catch (error) {
        if (error.name !== 'AbortError') throw error
        state.cancelled = true
        return c.json({ status: '等待已取消' }, 499)
      }
    }
  })
}
