import { CoreApprovalDiagram } from '@/diagrams/core-approval'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/core-control.zh.json'

// 按需加载核心组件章节中的一节中文内容。
export function Component () {
  return <Lesson resources={{ zh }} chapter='core' Diagram={CoreApprovalDiagram} diagramAfterSection={2} number={6} previous='/core/workflow' next='/core/skills' />
}
