import { Mastra } from '@mastra/core'
import { createDurableAgent } from '@mastra/core/agent/durable'
import { createAssistant, createStorage } from './assistant.js'

// 在本地存储上注册一个可按运行标识观察的助手。
const storage = await createStorage('durable')
// 配置本入口使用的核查助手。
const reviewer = createDurableAgent({ agent: createAssistant(storage) })
// 注册助手及其共用的运行服务。
const mastra = new Mastra({ agents: { reviewer }, storage })
// 保留运行清理函数。
let cleanup

try {
  const run = await reviewer.stream('材料：住宿每晚不超过 500 元，超出须事先书面批准。请核查一晚 560 元但没有批准记录的申请。', {
    memory: { thread: crypto.randomUUID(), resource: 'demo-user' }
  })
  cleanup = run.cleanup
  console.log('运行标识：', run.runId)
  console.log('核查结果：', await run.output.text)
} finally {
  await mastra.shutdown()
  cleanup?.()
  await storage.close()
}
