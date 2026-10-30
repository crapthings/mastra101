import { MCPClient } from '@mastra/mcp'
import { makeService } from './service.js'
import { startLocalHttp } from './local-http.js'

// 同一份教学服务改用 HTTP 传输，仍只监听本机回环地址。
const server = makeService()
// 应用负责 HTTP 监听，MCPServer 负责处理 /mcp 协议请求。
const host = await startLocalHttp(() => server, [server])
// URL 配置连接已运行的服务，不创建 stdio 子进程。
const client = new MCPClient({ id: 'activity-http-client', servers: { activity: { url: host.url } } })
try {
  const tools = await client.listTools()
  console.dir({ 入口: host.url.href, 工具: Object.keys(tools), result: await tools.activity_lookupNotice.execute({ activityId: 'reading' }) }, { depth: 5 })
} finally {
  await client.disconnect()
  await host.close()
}
