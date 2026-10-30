import { createLab } from './lab.js'

// 实际访问健康路由和 OpenAPI，区分初始化路由与监听端口。
const lab = await createLab()
try {
  const health = await fetch(`${lab.baseUrl}/health`)
  console.log('服务地址：', lab.baseUrl, '健康响应：', await health.json())
  const response = await fetch(`${lab.baseUrl}/api/openapi.json`)
  console.log('接口描述状态：', response.status)
  const spec = await response.json()
  console.log('接口路径数：', Object.keys(spec.paths).length)
} finally {
  await lab.close()
}
