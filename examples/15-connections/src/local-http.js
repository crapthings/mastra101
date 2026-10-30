import { createServer } from 'node:http'

// 将服务绑定到临时回环端口，并在返回值中提供明确的回收入口。
export async function startLocalHttp (selectService, services) {
  const http = createServer(async (req, res) => {
    try {
      const server = selectService(req)
      if (!server) {
        res.writeHead(401, { 'Content-Type': 'text/plain' })
        res.end('教学凭证缺失或不匹配')
        return
      }
      await server.startHTTP({ url: new URL(req.url || '/', 'http://127.0.0.1'), httpPath: '/mcp', req, res })
    } catch {
      if (!res.headersSent) res.writeHead(500)
      res.end('教学服务处理失败')
    }
  })
  await new Promise((resolve, reject) => {
    http.once('error', reject)
    http.listen(0, '127.0.0.1', resolve)
  })
  return {
    url: new URL(`http://127.0.0.1:${http.address().port}/mcp`),
    close: async () => {
      await Promise.all(services.map(server => server.close()))
      http.closeAllConnections()
      await new Promise((resolve, reject) => http.close(error => error ? reject(error) : resolve()))
    }
  }
}
