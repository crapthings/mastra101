import { createLab, request } from './lab.js'

// 核对公开、成员与内置路径，不能只检查一个登录入口。
const lab = await createLab()
try {
  await request(lab, '/public/notices')
  await request(lab, '/member/notices')
  await request(lab, '/api/workflows')
  await request(lab, '/member/notices', 'demo-member-a')
} finally { await lab.close() }
