import { WorkflowDataFlowDiagram } from '@/diagrams/workflow-data-flow'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/workflow-sequence.zh.json'

// 按需加载工作流章节的中文内容与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='workflows' number={3} previous='/workflows/schemas' next='/workflows/branching' Diagram={WorkflowDataFlowDiagram} diagramAfterSection={1} />
}
