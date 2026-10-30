import { SkillPackageDiagram } from '@/diagrams/skill-package'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/skill-resources.zh.json'

// 按需加载技能章节的中文内容与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='skills' number={5} previous='/skills/files' next='/skills/dynamic' Diagram={SkillPackageDiagram} diagramAfterSection={0} />
}
