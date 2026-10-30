import { registerApiRoute } from '@mastra/core/server'
import { permissions } from './policy.js'

// 业务接口分别演示公开内容、可信身份、角色权限与记录归属。
export function createRoutes (notices) {
  return [
    registerApiRoute('/public/notices', { method: 'GET', requiresAuth: false,
      handler: async c => c.json(notices.filter(n => n.published).map(n => ({ id: n.id, text: n.text })))
    }),
    registerApiRoute('/member/me', { method: 'GET', handler: async c => {
      const user = c.get('requestContext').get('user')
      return c.json({ id: user.id, name: user.name, role: user.role, teamId: user.teamId })
    } }),
    registerApiRoute('/member/notices', { method: 'GET', handler: async c => {
      const user = c.get('requestContext').get('user')
      return c.json(notices.filter(n => n.teamId === user.teamId))
    } }),
    registerApiRoute('/member/notices/:id', { method: 'GET', handler: async c => {
      const user = c.get('requestContext').get('user')
      const notice = notices.find(n => n.id === c.req.param('id') && n.teamId === user.teamId)
      return notice ? c.json(notice) : c.json({ error: '没有可读取的通知' }, 404)
    } }),
    registerApiRoute('/staff/notices/:id/publish', { method: 'POST', handler: async c => {
      const user = c.get('requestContext').get('user')
      if (!permissions[user.role]?.includes('notice:publish')) return c.json({ error: '没有发布通知的权限' }, 403)
      const notice = notices.find(n => n.id === c.req.param('id') && n.teamId === user.teamId)
      if (!notice) return c.json({ error: '没有可发布的通知' }, 404)
      notice.published = true
      return c.json({ id: notice.id, status: '已发布教学记录' })
    } })
  ]
}
