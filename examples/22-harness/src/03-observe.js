import assert from 'node:assert/strict'
import { Mastra } from '@mastra/core'
import { createDurableAgent } from '@mastra/core/agent/durable'
import { createAssistant, createStorage } from './assistant.js'

// 保留同一次运行，先读取结果，再从缓存回放完整事件。
const storage = await createStorage('observe')
// 配置本入口使用的核查助手。
const reviewer = createDurableAgent({ agent: createAssistant(storage) })
// 注册助手及其共用的运行服务。
const mastra = new Mastra({ agents: { reviewer }, storage })
// 保留运行清理函数。
let cleanup

try {
  const run = await reviewer.stream('材料：报销需在出差结束后 10 个工作日内提交。请列出核查这项时限还缺哪些信息。')
  cleanup = run.cleanup
  const original = await run.output.text
  const observation = await reviewer.observe(run.runId)
  try {
    const replay = await observation.output.text
    assert.equal(replay, original)
    console.log('同一运行回放一致：', run.runId)
    console.log(replay)
  } finally {
    observation.detach()
  }
} finally {
  await mastra.shutdown()
  cleanup?.()
  await storage.close()
}
