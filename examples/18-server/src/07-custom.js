import { createLab } from './lab.js'

// 自定义业务接口先验证 JSON，再调用共享的通知工作流。
const lab = await createLab()
try {
  for (const venue of ['南门', null, '']) {
    const response = await fetch(`${lab.baseUrl}/notice-preview`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ venue })
    })
    console.log('输入入口：', venue, 'HTTP 状态：', response.status, '内容：', await response.json())
  }
} finally {
  await lab.close()
}
