import { WorkflowBranchFlowDiagram } from '@/diagrams/workflow-branch-flow'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/workflow-branch.zh.json'

// 按需加载工作流章节的中文内容与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='workflows' number={4} previous='/workflows/sequential' next='/workflows/parallel' Diagram={WorkflowBranchFlowDiagram} diagramAfterSection={1} />
}
