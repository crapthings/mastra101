import { createServer } from 'node:http'

// 启动只提供能力卡与单次任务状态的本地 A2A 教学远端。
export async function startLocalA2A (mode) {
  const http = createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    const origin = `http://127.0.0.1:${http.address().port}`
    if (req.url === '/.well-known/agent-card.json') {
      res.end(JSON.stringify({
        protocolVersion: '0.3.0', name: '教学活动核对服务', description: '返回教学资料核对状态。', url: origin + '/a2a', version: '1.0.0',
        capabilities: { streaming: false }, defaultInputModes: ['text/plain'], defaultOutputModes: ['text/plain'],
        skills: [{ id: 'review', name: '核对通知', description: '按教学状态返回核对结果。', tags: ['活动'] }]
      }))
      return
    }
    if (req.url !== '/a2a' || req.method !== 'POST') {
      res.writeHead(404)
      res.end('{}')
      return
    }
    let body = ''
    for await (const chunk of req) body += chunk
    const request = JSON.parse(body)
    if (request.method !== 'message/send') {
      res.end(JSON.stringify({ jsonrpc: '2.0', id: request.id, error: { code: -32601, message: '教学服务未实现此方法' } }))
      return
    }
    const state = mode === '完成' ? 'completed' : mode === '等待' ? 'input-required' : 'failed'
    const text = mode === '完成' ? '教学通知明确南门入场，个人预约状态待确认。' : mode === '等待' ? '请补充活动通知。' : '教学核对任务失败，尚未取得结果。'
    const message = { kind: 'message', role: 'agent', messageId: 'demo-result', parts: [{ kind: 'text', text }] }
    res.end(JSON.stringify({ jsonrpc: '2.0', id: request.id, result: {
      kind: 'task', id: 'demo-task', contextId: 'demo-context', status: { state, ...(state === 'completed' ? {} : { message }) },
      artifacts: state === 'completed' ? [{ artifactId: 'review', parts: [{ kind: 'text', text }] }] : []
    } }))
  })
  await new Promise((resolve, reject) => {
    http.once('error', reject)
    http.listen(0, '127.0.0.1', resolve)
  })
  return {
    cardUrl: `http://127.0.0.1:${http.address().port}/.well-known/agent-card.json`,
    close: async () => {
      http.closeAllConnections()
      await new Promise((resolve, reject) => http.close(error => error ? reject(error) : resolve()))
    }
  }
}
