import { once } from 'node:events'
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { MastraServer } from '@mastra/hono'
import { createApplication } from './application.js'

// 初始化存储与后台执行后声明就绪，并提供有预算的关闭过程。
export async function startService (config) {
  const mastra = await createApplication(config)
  const state = { ready: false, stopping: false }
  const app = new Hono()
  app.get('/health/live', c => c.json({ status: '进程可响应', version: config.version }))
  app.get('/health/ready', c => c.json({ ready: state.ready, version: config.version }, state.ready ? 200 : 503))
  await new MastraServer({ app, mastra, prefix: '/api' }).init()
  const http = serve({ fetch: app.fetch, hostname: config.host, port: config.port })
  await once(http, 'listening')
  try {
    await mastra.startWorkers()
    state.ready = true
  } catch (error) {
    await new Promise(resolve => http.close(resolve))
    await mastra.shutdown()
    throw error
  }
  const address = `http://${config.host}:${http.address().port}`
  let closing
  return { mastra, state, address, close: reason => {
    if (closing) return closing
    state.ready = false
    state.stopping = true
    closing = (async () => {
      const timer = setTimeout(() => {
        console.log(JSON.stringify({ event: 'http.drain-timeout', version: config.version }))
        http.closeAllConnections()
      }, config.shutdownMs)
      timer.unref()
      try {
        await new Promise((resolve, reject) => http.close(error => error ? reject(error) : resolve()))
      } finally { clearTimeout(timer) }
      await mastra.shutdown({ drainTimeout: config.shutdownMs })
      console.log(JSON.stringify({ event: 'service.stopped', reason, version: config.version }))
    })()
    return closing
  } }
}
