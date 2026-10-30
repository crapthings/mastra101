import { MastraClient } from '@mastra/client-js'
import { createLab } from './lab.ts'

// 客户端 SDK 通过 HTTP 读取服务端能力，不把本地对象传进调用方。
const lab = await createLab()
try {
  const client = new MastraClient({ baseUrl: lab.baseUrl, retries: 0 })
  console.log('智能体标识：', Object.keys(await client.listAgents()))
  const workflow = client.getWorkflow('notice-check')
  const details = await workflow.details()
  console.log('工作流名称：', details.name)
  try {
    await client.getAgent('not-registered').details()
  } catch (error) {
    console.log('未知智能体：', error.message)
  }
} finally {
  await lab.close()
}
