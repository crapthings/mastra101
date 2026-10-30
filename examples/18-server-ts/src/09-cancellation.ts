import { createLab } from './lab.ts'

// 请求开始后取消客户端等待，再读取服务器现场状态以确认下游是否响应取消。
const lab = await createLab()
try {
  const controller = new AbortController()
  const request = fetch(`${lab.baseUrl}/slow-preview`, { method: 'POST', signal: controller.signal })
    .catch(error => error)
  for (let attempt = 0; attempt < 100 && !lab.state.started; attempt++) {
    await new Promise(resolve => setTimeout(resolve, 10))
  }
  if (!lab.state.started) throw new Error('服务端任务没有开始')
  controller.abort()
  const outcome = await request
  console.log('客户端结果：', outcome.name)
  for (let attempt = 0; attempt < 100 && !lab.state.cancelled && !lab.state.finished; attempt++) {
    await new Promise(resolve => setTimeout(resolve, 10))
  }
  console.log('服务端现场：', lab.state)
  if (!lab.state.cancelled || lab.state.finished) throw new Error('服务器没有按预期取消等待')
} finally {
  await lab.close()
}
