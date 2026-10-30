import { createSkill, validateSkillContent } from '@mastra/core/skills'

// name 作为稳定标识，description 说明何时使用，instructions 提供具体方法。
const skill = createSkill({
  name: 'departure-checklist', description: '活动资料已明确时，整理出发前准备清单。',
  instructions: '按证件、携带物、入场安排分组。缺少资料时标注待确认，不补造规定。'
})
console.dir({ name: skill.name, description: skill.description, instructions: skill.instructions })
// 在保存技能文件前检查目录名与元数据是否匹配。
const good = '---\nname: departure-checklist\ndescription: 整理活动出发清单。\n---\n按已有材料列清单，未知事项待确认。'
// 错误样本只修改名称，用来观察目录名不匹配。
const bad = good.replace('name: departure-checklist', 'name: different-name')
console.dir({ 正常: validateSkillContent({ content: good, directoryName: 'departure-checklist' }), 名称不匹配: validateSkillContent({ content: bad, directoryName: 'departure-checklist' }) }, { depth: null })
