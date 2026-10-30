import { randomBytes } from 'node:crypto'
import jwt from 'jsonwebtoken'
import { MastraJwtAuth } from '@mastra/auth'
import { createLab, request } from './lab.js'

// 临时签名密钥只存在于当前实验进程，不打印或保存。
const secret = randomBytes(32).toString('hex')
// 教学 JWT 仍由服务端校验签名和过期时间。
const auth = new MastraJwtAuth({ secret, mapUserToResourceId: user => user.sub, protected: ['/member/*', '/staff/*', '/api/*'], public: ['/public/*', '/api/auth/*'] })
// 使用与其他示例相同的业务接口观察 JWT 校验结果。
const lab = await createLab(auth)
try {
  const claims = { sub: 'member-a', id: 'member-a', name: '成员甲', role: 'member', teamId: 'team-a' }
  const valid = jwt.sign(claims, secret, { expiresIn: '5m', algorithm: 'HS256' })
  const expired = jwt.sign(claims, secret, { expiresIn: -1, algorithm: 'HS256' })
  const forged = jwt.sign(claims, randomBytes(32).toString('hex'), { algorithm: 'HS256' })
  await request(lab, '/member/me', valid)
  await request(lab, '/member/me', expired)
  await request(lab, '/member/me', forged)
} finally { await lab.close() }
