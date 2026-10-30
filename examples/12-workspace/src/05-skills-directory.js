import { Workspace, LocalFilesystem } from '@mastra/core/workspace'
import { resolve } from 'node:path'
import { Agent } from '@mastra/core/agent'
import { createSkill } from '@mastra/core/skills'

// 先准备工作区技能文件，再启动技能发现。
const filesystem = new LocalFilesystem({ basePath: resolve('lab/05-skills') })
await filesystem.init()
await filesystem.writeFile('skills/departure-checklist/SKILL.md', '---\nname: departure-checklist\ndescription: 按已确认资料整理出发清单。\n---\n完整列出入场安排和携带要求，缺口单独列出。')
// 路径 skills 相对工作区文件系统根解析。
const workspace = new Workspace({ filesystem, skills: ['skills'] })
await workspace.init()
try {
  // 使用共享技能的助手没有另外配置同名技能。
  const common = new Agent({ id: 'common-checklist', name: '常规清单助手', model: 'vercel/openai/gpt-6.1-sol', workspace })
  // 单个 Agent 的同名技能覆盖工作区版本，不修改磁盘文件。
  const brief = new Agent({ id: 'brief-checklist', name: '简短清单助手', model: 'vercel/openai/gpt-6.1-sol', workspace,
    skills: [createSkill({ name: 'departure-checklist', description: '整理简短出发清单。', instructions: '简短版本：最多三项，只使用已确认资料。' })]
  })
  console.log('工作区版本：', (await common.getSkill('departure-checklist'))?.instructions)
  console.log('Agent 覆盖版本：', (await brief.getSkill('departure-checklist'))?.instructions)
  console.log('原文件仍保留：', await filesystem.readFile('skills/departure-checklist/SKILL.md', { encoding: 'utf8' }))
} finally {
  await workspace.destroy()
}
