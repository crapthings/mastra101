import { createLab } from './lab.ts'

// 核对响应头与业务结果中的请求标识，观察中间件在路由前后的位置。
const lab = await createLab()
try {
  const response = await fetch(`${lab.baseUrl}/notice-preview`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Request-Id': 'client-request-demo' },
    body: JSON.stringify({ venue: '东门' })
  })
  const body = await response.json()
  console.log('响应头标识：', response.headers.get('X-Request-Id'))
  console.log('业务结果标识：', body.result.requestId)
} finally {
  await lab.close()
}
