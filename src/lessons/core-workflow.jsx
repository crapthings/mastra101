import { CoreWorkflowDiagram } from '@/diagrams/core-workflow'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/core-workflow.zh.json'

// 按需加载核心组件章节中的一节中文内容。
export function Component () {
  return <Lesson resources={{ zh }} chapter='core' Diagram={CoreWorkflowDiagram} diagramAfterSection={2} number={5} previous='/core/memory' next='/core/control' />
}
