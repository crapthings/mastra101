// 根据实际查询证据生成准备清单，让未知状态和来源保留在交付物中。
export function buildPreparationDraft (reservation) {
  if (reservation?.bookingId !== 'R001' || !['已预约', '未查到', '查询失败'].includes(reservation.status) || !reservation.source || !reservation.detail) {
    throw new Error('缺少有效的 R001 查询证据，不能生成准备清单。')
  }
  const nextAction = {
    已预约: '出发前再次核对预约记录。',
    未查到: '核对预约编号，向主办方确认报名状态。',
    查询失败: '稍后重试查询，当前不能确认报名状态。'
  }[reservation.status]
  return `# 阅读分享会准备清单

## 已知安排
- 周六 14:00 开始，13:30 开放入场。
- 来源：主办方活动说明（教学材料）；开放入场时间不是个人到达时间。

## 报名查询
- 编号：${reservation.bookingId}
- 状态：${reservation.status}
- 查询说明：${reservation.detail}
- 来源：${reservation.source}

## 待办与待确认
- [ ] ${nextAction}
- [ ] 向主办方确认地点；现有材料尚未公布地点。
- [ ] 地点确认后再安排个人出发和到达时间。

这是本地教学草稿；保存文件不代表已预约或已发送提醒。
`
}
