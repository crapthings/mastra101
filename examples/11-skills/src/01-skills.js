import { Agent } from '@mastra/core/agent'
import { createSkill } from '@mastra/core/skills'

// 把一种具体任务的方法单独维护，避免全塞进 Agent 的通用职责。
const reviewSkill = createSkill({
  name: 'activity-review', description: '用于核对活动时间、地点、预约要求和缺失信息。',
  instructions: '先逐项提取原文明确内容，再列出待确认项；保留来源，不把预约要求写成已预约。'
})
// 系统提示词负责通用职责，skills 提供可发现的任务方法。
const agent = new Agent({
  id: 'skill-intro', name: '活动资料助手', model: 'vercel/openai/gpt-6.1-sol',
  instructions: '用中文帮助用户处理活动资料。', skills: [reviewSkill]
})
console.table(await agent.listSkills())
console.log('该技能的完整规则：', (await agent.getSkill('activity-review'))?.instructions)
