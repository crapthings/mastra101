import { Agent } from '@mastra/core/agent'

// 通过 instructions 配置系统提示词，定义活动资料助手的通用规则。
const activityAgent = new Agent({
  id: 'activity-guide',
  name: '活动资料助手',
  instructions: `
    用中文核对用户提供的活动资料。
    分开列出已确认信息与待确认事项，保留条件和来源。
    不根据常识补写地点、个人预约状态或到达时间。
    没有执行外部操作时，不声称已经预约、修改或通知他人。
  `,
  model: 'vercel/openai/gpt-6.1-sol'
})

// 通过用户提示词提供本次任务与材料，请求核对活动安排。
const result = await activityAgent.generate(`
  请核对下面的活动资料，列出已确认信息与待确认事项。
  来源：主办方活动说明（教学材料）。
  活动周六下午两点开始，一点半开放入场，需要提前预约。
  地点尚未公布，材料没有记录任何参加者的预约结果。
`, {
  maxSteps: 1,
  abortSignal: AbortSignal.timeout(60_000)
})

console.log(result.text || '本次没有生成最终文本。')
