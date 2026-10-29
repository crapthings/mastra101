import { ContextDiagram } from '@/diagrams/context'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/context.zh.json'

// This route loads one Chinese lesson on demand.
export function Component () {
  return <Lesson resources={{ zh }} chapter='llm' Diagram={ContextDiagram} diagramAfterSection={1} number={4} previous='/llm/messages' next='/llm/attention' />
}
