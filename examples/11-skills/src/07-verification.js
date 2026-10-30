import { Agent } from '@mastra/core/agent'
import { createSkill } from '@mastra/core/skills'

// 规则要求保留原文的条件和缺口，而不是一律生成完整安排。
const review = createSkill({ name: 'activity-review', description: '核对活动资料和待确认事项。', instructions: '按已确认、待确认两组整理；只使用原文。未知地点写待确认，未提供个人预约记录时不宣称已预约。' })
// 输出执行记录，便于区分技能已提供、已加载与结果符合规则。
const agent = new Agent({ id: 'skill-review', name: '活动核对助手', model: 'vercel/openai/gpt-6.1-sol', instructions: '用中文回答。先用 skill 工具加载 activity-review，再核对资料。', skills: [review] })
// 两组小资料分别覆盖有地点与缺地点，不依赖会话历史。
const cases = ['主办方资料：周六两点开始，南门入场，需要预约，未提供个人预约记录。', '主办方资料：周六两点开始，地点未公布，需要预约，未提供个人预约记录。']
for (const material of cases) {
  console.log('本次资料：', material)
  const result = await agent.generate(material, {
    maxSteps: 4, abortSignal: AbortSignal.timeout(60_000),
    onStepFinish: ({ toolCalls, toolResults }) => console.dir({ toolCalls, toolResults }, { depth: null })
  })
  console.log(result.text || '没有最终文本，请检查结束原因。')
}
