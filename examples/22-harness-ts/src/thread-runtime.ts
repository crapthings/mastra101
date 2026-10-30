import { Mastra } from '@mastra/core'
import { createAssistant, createStorage } from './assistant.ts'

// 创建已经存在的教学线程，让订阅、状态与通知使用同一归属。
export async function createThreadRuntime (name, options = {}) {
  const storage = await createStorage(name)
  const reviewer = createAssistant(storage, options)
  const mastra = new Mastra({ agents: { reviewer }, storage })
  const thread = { resourceId: 'demo-user', threadId: crypto.randomUUID() }
  const memory = await reviewer.getMemory()
  await memory.createThread({ ...thread, title: '差旅制度核查' })
  return {
    reviewer, mastra, storage, thread,
    close: async () => {
      await mastra.shutdown()
      await storage.close()
    }
  }
}

// 在同一个线程订阅中等一次运行结束，超时退出时保留未完成含义。
export async function receiveTurn (subscription, send) {
  const reader = subscription.stream[Symbol.asyncIterator]()
  const timer = setTimeout(() => subscription.unsubscribe(), 60_000)
  try {
    const received = (async () => {
      let text = ''
      for (;;) {
        const { value: chunk, done } = await reader.next()
        if (done) throw new Error('订阅结束，尚未取得本次运行状态')
        if (chunk.type === 'text-delta') text += chunk.payload.text
        if (chunk.type === 'thread-run-status') {
          if (chunk.payload.status !== 'success') throw new Error(`本次运行没有成功结束：${chunk.payload.status}`)
          return { runId: chunk.runId, text, status: chunk.payload.status }
        }
      }
    })()
    // 立即接上拒绝处理，发送失败时也不会遗留未处理的读取异常。
    received.catch(() => {})
    const result = await send()
    if (result?.accepted) {
      const { action, runId } = await result.accepted
      console.log('投递决定：', { action, runId })
    }
    return await received
  } finally {
    clearTimeout(timer)
  }
}
