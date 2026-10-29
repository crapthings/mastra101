import { LoopDiagram } from '@/diagrams/loop'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/loop.zh.json'

// This route loads one Chinese lesson on demand.
export function Component () {
  return <Lesson resources={{ zh }} chapter='llm' Diagram={LoopDiagram} diagramAfterSection={2} number={9} previous='/llm/tools' next='/framework' />
}
