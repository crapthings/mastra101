import { WorkflowParallelForeachDiagram } from '@/diagrams/workflow-parallel-foreach'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/workflow-parallel.zh.json'

// 按需加载工作流章节的中文内容与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='workflows' number={5} previous='/workflows/branching' next='/workflows/resume' Diagram={WorkflowParallelForeachDiagram} diagramAfterSection={1} />
}
