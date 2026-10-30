import { MCPClient } from '@mastra/mcp'
import { fileURLToPath } from 'node:url'

// 资源与提示模板使用各自的发现和读取方法。
const client = new MCPClient({
  id: 'activity-resource-client',
  servers: { activity: { command: process.execPath, args: [fileURLToPath(new URL('./stdio-server.ts', import.meta.url))] } }
})
try {
  const resources = await client.resources.list()
  const content = await client.resources.read('activity', 'activity://reading/notice')
  const prompts = await client.prompts.list()
  const prompt = await client.prompts.get({ serverName: 'activity', name: 'review-notice', args: { material: '地点尚未公布，需要提前预约。' } })
  console.dir({ resources, content, prompts, prompt }, { depth: 6 })
} finally {
  await client.disconnect()
}
