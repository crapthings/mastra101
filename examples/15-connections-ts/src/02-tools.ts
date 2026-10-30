import { MCPClient } from '@mastra/mcp'
import { fileURLToPath } from 'node:url'

// 只接受三个教学编号，分别检查正常、未查到与查询失败。
const activityId = process.argv[2] || 'reading'
if (!['reading', 'unknown', 'FAIL'].includes(activityId)) throw new Error('请使用 reading、unknown 或 FAIL。')
// 子进程运行随包服务，不安装或启动第三方命令。
const client = new MCPClient({
  id: 'activity-stdio-client',
  servers: { activity: { command: process.execPath, args: [fileURLToPath(new URL('./stdio-server.ts', import.meta.url))] } }
})
try {
  const tools = await client.listTools()
  console.log('实际发现的工具：', Object.keys(tools))
  const tool = tools.activity_lookupNotice
  if (!tool?.execute) throw new Error('没有发现可执行的教学查询工具。')
  const result = await tool.execute({ activityId })
  console.dir({ result }, { depth: 5 })
} finally {
  await client.disconnect()
}
