import { MCPClient } from '@mastra/mcp'
import { randomUUID } from 'node:crypto'
import { makeService } from './service.js'
import { startLocalHttp } from './local-http.js'

// 两个 token 只是公开教学标识，不是真实凭证。
const readers = new Map([['demo-reader-a', makeService('读者甲')], ['demo-reader-b', makeService('读者乙')]])
// 服务端按收到的凭证选择数据范围，拒绝不认识的值。
const host = await startLocalHttp(req => {
  const token = req.headers.authorization?.match(/^Bearer ([A-Za-z0-9-]+)$/)?.[1]
  return readers.get(token)
}, [...readers.values()])
try {
  for (const token of ['demo-reader-a', 'demo-reader-b', 'demo-invalid']) {
    const client = new MCPClient({
      id: `request-${randomUUID()}`,
      servers: { activity: { url: host.url, requestInit: { headers: { Authorization: `Bearer ${token}` } } } }
    })
    try {
      const { tools, errors, errorDetails } = await client.listToolsWithErrors({ perServerTimeoutMs: 3000 })
      if (Object.keys(errors).length) {
        console.dir({ 发现失败: Object.keys(errors), 状态码: errorDetails.activity?.httpStatus })
        continue
      }
      console.dir({ result: await tools.activity_lookupNotice.execute({ activityId: 'reading' }) }, { depth: 5 })
    } finally {
      await client.disconnect()
    }
  }
} finally {
  await host.close()
}
