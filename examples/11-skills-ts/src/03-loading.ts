import { Agent } from '@mastra/core/agent'
import { createSkill } from '@mastra/core/skills'

// 技能目录先提供用途，模型需要时再读取完整规则。
const review = createSkill({ name: 'activity-review', description: '核对活动资料中的明确事实与缺口。', instructions: '列出已确认和待确认两组；地点未知时保留未知，不推测预约结果。' })
// 另一个技能帮助观察模型是否选择了适用的方法。
const reminder = createSkill({ name: 'short-reminder', description: '根据已确认安排撰写简短提醒文案。', instructions: '只写已确认安排，表达简短，不声称已经发送。' })
// 要求先加载相关技能，执行记录用于核对实际行为。
const agent = new Agent({
  id: 'skill-loading', name: '活动资料助手', model: 'vercel/openai/gpt-6.1-sol',
  instructions: '用中文回答。处理任务前先通过 skill 工具读取匹配技能，再依据其规则处理材料。', skills: [review, reminder]
})
// 本次任务是核对资料，不是写提醒或发送通知。
const result = await agent.generate('请核对活动资料：主办方说周六下午两点开始，需要预约，地点尚未公布。', {
  maxSteps: 4, abortSignal: AbortSignal.timeout(60_000),
  onStepFinish: ({ toolCalls, toolResults }) => console.dir({ toolCalls, toolResults }, { depth: null })
})
console.log(result.text || '没有最终文本，请检查运行记录。')
