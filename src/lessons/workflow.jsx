import { WorkflowDiagram } from '@/diagrams/workflow'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/workflow.zh.json'

// This route loads one framework concept on demand.
export function Component () {
  return <Lesson resources={{ zh }} chapter='framework' Diagram={WorkflowDiagram} diagramAfterSection={1} number={3} previous='/framework/memory' next='/framework/harness' />
}
