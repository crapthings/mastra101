import { once } from 'node:events'
import { randomUUID } from 'node:crypto'
import { Mastra } from '@mastra/core/mastra'
import { Agent } from '@mastra/core/agent'
import { createStep, createWorkflow } from '@mastra/core/workflows'
import { LibSQLStore } from '@mastra/libsql'
import { MastraServer } from '@mastra/hono'
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { z } from 'zod'
import { createRoutes } from './routes.js'

// 每个入口启动独立的回环 HTTP 服务，完成请求后统一关闭资源。
export async function createLab () {
  const state = { started: false, finished: false, cancelled: false }
  const inputSchema = z.object({ venue: z.string().min(1).nullable() })
  const outputSchema = z.object({ status: z.string(), venue: z.string().nullable(), requestId: z.string() })
  const prepare = createStep({
    id: 'prepare-notice', inputSchema, outputSchema,
    execute: async ({ inputData, requestContext }) => ({
      status: inputData.venue === null ? '待确认' : '已确认', venue: inputData.venue,
      requestId: requestContext.get('requestId')
    })
  })
  const workflow = createWorkflow({ id: 'notice-check', inputSchema, outputSchema }).then(prepare).commit()
  const agent = new Agent({
    id: 'notice-helper', name: '通知助手', model: 'vercel/openai/gpt-6.1-sol',
    instructions: '只根据用户给定的通知整理入场提醒。入口未公布时明确待确认，不补写入口。'
  })
  const mastra = new Mastra({
    agents: { noticeHelper: agent }, workflows: { noticeCheck: workflow },
    storage: new LibSQLStore({ id: 'http-lab', url: ':memory:' }),
    server: {
      apiRoutes: createRoutes(state),
      middleware: [async (c, next) => {
        const requestId = randomUUID()
        c.get('requestContext').set('requestId', requestId)
        await next()
        c.header('X-Request-Id', requestId)
      }]
    }
  })
  const app = new Hono()
  const adapter = new MastraServer({ app, mastra, prefix: '/api', openapiPath: '/openapi.json' })
  await adapter.init()
  const http = serve({ fetch: app.fetch, hostname: '127.0.0.1', port: 0 })
  await once(http, 'listening')
  const baseUrl = `http://127.0.0.1:${http.address().port}`
  return { mastra, app, baseUrl, state, close: async () => {
    await new Promise((resolve, reject) => http.close(error => error ? reject(error) : resolve()))
    await mastra.shutdown()
  } }
}
