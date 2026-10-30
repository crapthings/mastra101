import { Agent } from '@mastra/core/agent'

// 本章的父子模型都沿用同一个网关入口。
export const model = 'vercel/openai/gpt-6.1-sol'
// 这份教学通知是各节核对信息的共同依据。
export const activity = '社区阅读分享会：周六下午两点开始，一点半开放入场，南门进入，需要提前预约。未提供个人预约记录。'
// 核对助手只整理已有事实与缺口，不执行预约。
export function makeReviewer (options = {}) {
  return new Agent({
    id: 'activity-reviewer', name: '资料核对助手', model,
    description: '核对活动通知中的开始、入场、地点与预约要求，返回已确认信息和待确认事项。',
    instructions: '核对所提供的活动材料，分为已确认和待确认。保留时间含义、条件与来源，不补写地点或个人预约状态。',
    defaultOptions: { maxSteps: 2 },
    ...options
  })
}
// 主助手把资料核对交给 reviewer，再依据返回内容向用户说明。
export function makeCoordinator (agents, options = {}) {
  return new Agent({
    id: 'activity-coordinator', name: '活动主助手', model, agents,
    instructions: '把活动资料核对委派给 reviewer，依据其结果回答。保留来源和缺口，不声称已经完成预约。',
    ...options
  })
}
// 打印父子各自的模型步骤，便于将委派与普通工具执行区分开。
export function logStep (label) {
  return ({ stepNumber, toolCalls, toolResults, finishReason }) => {
    console.dir({ 位置: label, stepNumber, toolCalls, toolResults, finishReason }, { depth: 6 })
  }
}
