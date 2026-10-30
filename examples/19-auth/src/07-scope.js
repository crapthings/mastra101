import { createLab, request } from './lab.js'

// 列表、单条读取与发布都核对记录归属，角色权限不能替代此检查。
const lab = await createLab()
try {
  await request(lab, '/member/notices', 'demo-member-a')
  await request(lab, '/member/notices/notice-b', 'demo-member-a')
  await request(lab, '/staff/notices/notice-b/publish', 'demo-staff-a', { method: 'POST' })
  await request(lab, '/member/notices', 'demo-member-b')
} finally { await lab.close() }
