import { MastraClient } from '@mastra/client-js'
import { createLab } from './lab.js'

// 客户端先创建运行，再启动执行，并按同一 runId 读取保存的状态。
const lab = await createLab()
try {
  const client = new MastraClient({ baseUrl: lab.baseUrl, retries: 0 })
  const workflow = client.getWorkflow('notice-check')
  const run = await workflow.createRun()
  const result = await run.startAsync({ inputData: { venue: null } })
  const saved = await workflow.runById(run.runId)
  console.log('运行标识：', run.runId, '返回状态：', result.status, '结果：', result.result)
  console.log('读回状态：', saved.status)
  const reconnected = await workflow.createRun({ runId: run.runId })
  console.log('重新连接同一运行：', reconnected.runId === run.runId)
} finally {
  await lab.close()
}
