import { once } from 'node:events'
import { Mastra } from '@mastra/core/mastra'
import { LibSQLStore } from '@mastra/libsql'
import { SimpleAuth } from '@mastra/core/server'
import { MastraServer } from '@mastra/hono'
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { tokens, createNotices } from './policy.ts'
import { createRoutes } from './routes.ts'

// 以实际 Mastra 认证保护两组业务路径，公开路由单独声明。
export async function createLab (provider) {
  const auth = provider ?? new SimpleAuth({
    tokens, protected: ['/member/*', '/staff/*', '/api/*'], public: ['/public/*', '/api/auth/*'],
    mapUserToResourceId: user => user.id
  })
  const mastra = new Mastra({ storage: new LibSQLStore({ id: 'auth-lab', url: ':memory:' }), server: { auth, apiRoutes: createRoutes(createNotices()) } })
  const app = new Hono()
  await new MastraServer({ app, mastra, prefix: '/api' }).init()
  const http = serve({ fetch: app.fetch, hostname: '127.0.0.1', port: 0 })
  await once(http, 'listening')
  return { baseUrl: `http://127.0.0.1:${http.address().port}`, close: async () => {
    await new Promise((resolve, reject) => http.close(error => error ? reject(error) : resolve()))
    await mastra.shutdown()
  } }
}

// 用一条明确的 HTTP 请求打印状态与结果，不记录完整令牌。
export async function request (lab, path, token, options = {}) {
  const headers = { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers }
  const response = await fetch(lab.baseUrl + path, { ...options, headers })
  const body = await response.json()
  console.log(path, response.status, body)
  return { status: response.status, body }
}
