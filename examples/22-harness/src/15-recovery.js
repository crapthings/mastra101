import { setTimeout } from 'node:timers/promises'
import { Mastra } from '@mastra/core'
import { createDurableAgent } from '@mastra/core/agent/durable'
import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import { createAssistant, createStorage } from './assistant.js'

// 用可以重复执行的只读检查留出观察进程中断的时间。
const readChecklist = createTool({
  id: 'read-checklist',
  description: '读取制度核查清单，这个演示读取需要约 20 秒。',
  inputSchema: z.object({}),
  execute: async () => {
    await setTimeout(20_000)
    return { limit: 500, approvalRequired: true, missing: ['事先书面批准记录'] }
  }
})
// 显式保存运行中的检查点，为手动恢复提供依据。
const storage = await createStorage('recovery')
// 配置本入口使用的核查助手。
const reviewer = createDurableAgent({
  agent: createAssistant(storage, { tools: { readChecklist } }),
  shouldPersistSnapshot: ({ workflowStatus }) => ['pending', 'running', 'paused', 'suspended'].includes(workflowStatus)
})
// 注册助手及其共用的运行服务。
const mastra = new Mastra({ agents: { reviewer }, storage })
// 默认只查看记录，启动和恢复都需要明确选择入口模式。
const mode = process.argv[2] || 'inspect'
// 保留运行清理函数。
let cleanup

try {
  if (mode === 'start') {
    const run = await reviewer.stream('必须先调用 readChecklist，再核查一晚 560 元但没有批准记录的住宿申请。')
    cleanup = run.cleanup
    console.log('运行标识：', run.runId)
    console.log(await run.output.text)
  } else if (mode === 'recover') {
    console.log('恢复结果：', await reviewer.recoverActiveRuns())
  } else if (mode === 'inspect') {
    console.log('运行记录：', await reviewer.listActiveRuns())
  } else {
    throw new Error('仅支持 start、inspect 或 recover')
  }
} finally {
  await mastra.shutdown()
  cleanup?.()
  await storage.close()
}
