import { createTool } from '@mastra/core/tools'
import { z } from 'zod'

// 为各节提供同一组只读教学查询，显式选择正常、未查到或失败状态。
export function createReservationTool (mode = '正常') {
  const selectedMode = z.enum(['正常', '未查到', '失败']).parse(mode)
  return createTool({
    id: 'lookup-reservation',
    description: '按预约编号查询本地教学记录，不创建或修改预约。',
    inputSchema: z.object({ bookingId: z.string().min(1) }),
    outputSchema: z.object({
      bookingId: z.string(),
      status: z.enum(['已预约', '未查到', '查询失败']),
      detail: z.string(),
      source: z.string()
    }),
    execute: async ({ bookingId }) => {
      const base = { bookingId, source: '本地教学数据，不是真实预约记录' }
      if (selectedMode === '失败') {
        return { ...base, status: '查询失败', detail: '模拟预约服务暂时不可用。' }
      }
      if (selectedMode === '未查到' || bookingId !== 'R001') {
        return { ...base, status: '未查到', detail: '教学数据中没有匹配编号。' }
      }
      return { ...base, status: '已预约', detail: '阅读分享会，周六下午两点开始，预约人数为 1 人。' }
    }
  })
}
