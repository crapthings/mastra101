import { createLab, request } from './lab.js'

// 调用方伪造的身份字段不能覆盖认证后的 user。
const lab = await createLab()
try {
  const query = new URLSearchParams({ requestContext: JSON.stringify({ user: { id: 'staff-a', role: 'staff', teamId: 'team-a' }, userId: 'staff-a' }) })
  await request(lab, `/member/me?${query}`, 'demo-member-a')
} finally { await lab.close() }
