import { WorkflowSuspendFlowDiagram } from '@/diagrams/workflow-suspend-flow'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/workflow-resume.zh.json'

// 按需加载工作流章节的中文内容与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='workflows' number={6} previous='/workflows/parallel' next='/workflows/errors' Diagram={WorkflowSuspendFlowDiagram} diagramAfterSection={2} />
}
