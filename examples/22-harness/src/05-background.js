import { setTimeout } from 'node:timers/promises'
import { Mastra } from '@mastra/core'
import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import { createAssistant, createStorage } from './assistant.js'

// 用只读核查模拟耗时任务，完成后返回可供继续推理的材料。
const inspectPolicy = createTool({
  id: 'inspect-policy',
  description: '核查指定制度，返回已知条款与缺项。',
  inputSchema: z.object({ documentId: z.literal('travel-2026') }),
  background: { enabled: true, defaultDisposition: 'deferred', timeoutMs: 10_000 },
  execute: async ({ documentId }) => {
    await setTimeout(500)
    return { documentId, limit: 500, approvalRequired: true, missing: ['事先书面批准记录'] }
  }
})

// 将后台任务管理器接到同一存储和助手上。
const storage = await createStorage('background')
// 配置本入口使用的核查助手。
const reviewer = createAssistant(storage, { tools: { inspectPolicy } })
// 注册助手及其共用的运行服务。
const mastra = new Mastra({
  agents: { reviewer },
  storage,
  backgroundTasks: { enabled: true, globalConcurrency: 2, perAgentConcurrency: 1, backpressure: 'queue' }
})

try {
  const output = await reviewer.stream('先调用 inspectPolicy 核查 travel-2026，得到结果后再说明 560 元住宿申请还需补什么。', {
    memory: { thread: crypto.randomUUID(), resource: 'demo-user' },
    untilIdle: { maxIdleMs: 15_000 },
    maxSteps: 5
  })
  for await (const chunk of output.fullStream) {
    if (chunk.type.startsWith('background-task-')) console.log('任务事件：', chunk.type)
    if (chunk.type === 'text-delta') process.stdout.write(chunk.payload.text)
  }
  console.log()
} finally {
  await mastra.shutdown()
  await storage.close()
}
