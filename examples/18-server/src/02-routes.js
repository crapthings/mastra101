import { createLab } from './lab.js'

// 比较目录查询、未知资源与创建运行的响应。
const lab = await createLab()
try {
  const paths = ['/api/agents', '/api/workflows', '/api/agents/not-registered']
  for (const path of paths) {
    const response = await fetch(lab.baseUrl + path)
    const body = await response.json()
    console.log('路径：', path, 'HTTP 状态：', response.status, '内容：', body.error ?? Object.keys(body))
  }
  const response = await fetch(`${lab.baseUrl}/api/workflows/notice-check/create-run`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({})
  })
  console.log('创建运行：', response.status, await response.json())
} finally {
  await lab.close()
}
