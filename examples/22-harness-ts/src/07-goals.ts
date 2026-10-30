import { Mastra } from '@mastra/core'
import { createAssistant, createStorage } from './assistant.ts'

// 用独立目标判定约束核查任务最多接受三次候选结果。
const storage = await createStorage('goals')
// 配置本入口使用的核查助手。
const reviewer = createAssistant(storage, {
  goal: { judge: 'vercel/openai/gpt-6.1-sol', maxRuns: 3 }
})
// 注册助手及其共用的运行服务。
const mastra = new Mastra({ agents: { reviewer }, storage })
// 为这次目标创建独立线程。
const threadId = crypto.randomUUID()
// 标记演示线程的所有者。
const resourceId = 'demo-user'

try {
  await reviewer.setObjective('核查 560 元住宿申请：明确 500 元上限、需要事先书面批准，以及当前缺少批准记录，不能直接判为可报销。', { threadId, resourceId })
  const output = await reviewer.stream('材料：住宿每晚不超过 500 元，超出须事先书面批准。申请金额为 560 元，没有提供批准记录。开始核查。', {
    memory: { thread: threadId, resource: resourceId },
    maxSteps: 4
  })
  for await (const chunk of output.fullStream) {
    if (chunk.type === 'goal') console.log('目标判定：', chunk.payload)
  }
  console.log('目标记录：', await reviewer.getObjective({ threadId }))
} finally {
  await mastra.shutdown()
  await storage.close()
}
