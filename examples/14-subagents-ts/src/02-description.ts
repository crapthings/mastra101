import { Agent } from '@mastra/core/agent'
import { model, makeReviewer, makeCoordinator } from './shared.ts'

// description 对外说明核对任务，instructions 对内说明处理原则。
const reviewer = makeReviewer()
// 文案助手接收已核对资料，负责组织表达，不负责查证新事实。
const writer = new Agent({
  id: 'reminder-writer', name: '提醒文案助手', model,
  description: '根据已核对的事实与待确认清单编写简短提醒，不查询或补充活动规定。',
  instructions: '只根据收到的核对结果编写中文提醒，保留待确认事项，不把未完成预约写成已完成。'
})
// 配置多个子智能体后，先在不调用模型的情况下核对职责目录。
const parent = makeCoordinator({ reviewer, writer })
for (const [key, agent] of Object.entries(await parent.listAgents())) {
  console.dir({ 注册键: key, Agent标识: agent.id, 用途: agent.getDescription(), 系统提示词: await agent.getInstructions() })
}
