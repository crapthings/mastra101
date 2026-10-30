import { createLab, request } from './lab.js'

// 同一发布操作需要角色权限，登录成功并不自动允许写入。
const lab = await createLab()
try {
  await request(lab, '/staff/notices/notice-a/publish', 'demo-member-a', { method: 'POST' })
  await request(lab, '/staff/notices/notice-a/publish', 'demo-staff-a', { method: 'POST' })
} finally { await lab.close() }
