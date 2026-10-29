import { CoreSkillsDiagram } from '@/diagrams/core-skills'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/core-skills.zh.json'

// 按需加载核心组件章节中的一节中文内容。
export function Component () {
  return <Lesson resources={{ zh }} chapter='core' Diagram={CoreSkillsDiagram} diagramAfterSection={3} number={7} previous='/core/control' next='/core/evaluation' />
}
