import { MCPClient } from '@mastra/mcp'
import { Mastra } from '@mastra/core'
import { LibSQLStore } from '@mastra/libsql'
import { makeService } from './service.js'
import { startLocalHttp } from './local-http.js'

// 把本项目的工具、资源和提示模板公开成一个 MCPServer。
const server = makeService()
// 真实 Mastra Server 项目可以注册该实例，交由服务路由承载。
const mastra = new Mastra({ mcpServers: { activity: server }, storage: new LibSQLStore({ id: 'published-tools', url: ':memory:' }) })
// 本例直接使用临时 HTTP 监听验证同一服务，不启动项目开发服务器。
const host = await startLocalHttp(() => server, [server])
// 模拟另一个 MCP 客户端，只使用公开的协议接口。
const external = new MCPClient({ id: 'external-reader', servers: { activity: { url: host.url } } })
try {
  const tools = await external.listTools()
  console.dir({ 已注册服务: Object.keys(mastra.listMCPServers()), 外部工具: Object.keys(tools), result: await tools.activity_lookupNotice.execute({ activityId: 'reading' }) }, { depth: 5 })
} finally {
  await external.disconnect()
  await host.close()
}
