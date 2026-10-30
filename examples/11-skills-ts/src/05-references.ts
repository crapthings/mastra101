import { Agent } from '@mastra/core/agent'
import { fileURLToPath } from 'node:url'
import { readFile } from 'node:fs/promises'

// 程序使用同一个技能目录，先查看它带有哪些支持文件。
const directory = fileURLToPath(new URL('../materials/skills/activity-review/', import.meta.url))
// 此示例只读取技能与模板，不发起模型请求。
const agent = new Agent({ id: 'skill-references', name: '资料模板助手', model: 'vercel/openai/gpt-6.1-sol', skills: [directory] })
// 元数据中的文件列表并不等于模型已经读取了文件内容。
const skill = await agent.getSkill('activity-review')
console.dir({ references: skill?.references, assets: skill?.assets })
console.log('核对依据：', await readFile(new URL('../materials/skills/activity-review/references/checks.md', import.meta.url), 'utf8'))
console.log('交付模板：', await readFile(new URL('../materials/skills/activity-review/assets/result-template.md', import.meta.url), 'utf8'))
