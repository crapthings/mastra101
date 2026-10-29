import { ToolsDiagram } from '@/diagrams/tools'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/tools.zh.json'

// This route loads one Chinese lesson on demand.
export function Component () {
  return <Lesson resources={{ zh }} chapter='llm' Diagram={ToolsDiagram} diagramAfterSection={1} number={8} previous='/llm/knowledge' next='/llm/loop' />
}
