import { Agent } from '@mastra/core/agent'
import { createSkill } from '@mastra/core/skills'
import { RequestContext } from '@mastra/core/request-context'
import { z } from 'zod'

// 核对资料的方法只在应用确认的任务类型匹配时提供。
const review = createSkill({ name: 'activity-review', description: '核对活动资料与未知项。', instructions: '按原文核对时间与地点，列出缺口。' })
// 提醒任务使用另一份方法。
const reminder = createSkill({ name: 'short-reminder', description: '编写简短活动提醒。', instructions: '只使用已确认资料，不声称已经发送。' })
// 应用条件决定可用技能，技能本身不赋予执行权限。
const agent = new Agent({
  id: 'dynamic-skills', name: '活动助手', model: 'vercel/openai/gpt-6.1-sol',
  skills: ({ requestContext }) => z.enum(['资料核对', '提醒文案']).parse(requestContext.get('task')) === '资料核对' ? [review] : [reminder]
})
for (const task of ['资料核对', '提醒文案']) {
  const requestContext = new RequestContext()
  requestContext.set('task', task)
  console.log(task, (await agent.listSkills({ requestContext })).map(skill => skill.name))
}
