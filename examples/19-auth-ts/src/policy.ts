// 公开教学令牌仅用于本地实验，不包含真实账号凭证。
export const tokens = {
  'demo-member-a': { id: 'member-a', name: '成员甲', role: 'member', teamId: 'team-a' },
  'demo-member-b': { id: 'member-b', name: '成员乙', role: 'member', teamId: 'team-b' },
  'demo-staff-a': { id: 'staff-a', name: '工作人员甲', role: 'staff', teamId: 'team-a' }
}

// 应用业务权限表将角色映射到允许的操作。
export const permissions = { member: ['notice:read'], staff: ['notice:read', 'notice:publish'] }

// 每次实验建立独立资料，避免跨入口遗留发布结果。
export function createNotices () {
  return [
    { id: 'notice-a', teamId: 'team-a', text: '阅读分享会从南门入场。', published: true },
    { id: 'notice-b', teamId: 'team-b', text: '展览从东门入场。', published: false }
  ]
}
