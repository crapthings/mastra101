import { createLab, request } from './lab.ts'

// 分别验证缺少凭证、错误凭证与已知教学凭证的处理。
const lab = await createLab()
try {
  await request(lab, '/member/me')
  await request(lab, '/member/me', 'not-a-valid-token')
  await request(lab, '/member/me', 'demo-member-a')
} finally { await lab.close() }
