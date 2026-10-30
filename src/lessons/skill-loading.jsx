import { SkillLoadingFlowDiagram } from '@/diagrams/skill-loading-flow'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/skill-loading.zh.json'

// 按需加载技能章节的中文内容与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='skills' number={3} previous='/skills/definition' next='/skills/files' Diagram={SkillLoadingFlowDiagram} diagramAfterSection={1} />
}
