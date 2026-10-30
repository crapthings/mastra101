import { Agent } from '@mastra/core/agent'
import { fileURLToPath } from 'node:url'

// 技能目录来自随包材料，绝对路径不随命令启动目录改变。
const directory = fileURLToPath(new URL('../materials/skills/activity-review/', import.meta.url))
// Agent 可以直接加载文件技能，不必先配置 Workspace 或 Sandbox。
const agent = new Agent({
  id: 'file-skill', name: '活动资料助手', model: 'vercel/openai/gpt-6.1-sol',
  instructions: '用中文核对活动资料。', skills: [directory]
})
console.table(await agent.listSkills())
console.log((await agent.getSkill('activity-review'))?.instructions)
