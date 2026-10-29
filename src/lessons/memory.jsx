import { MemoryDiagram } from '@/diagrams/memory'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/memory.zh.json'

// This route loads one framework concept on demand.
export function Component () {
  return <Lesson resources={{ zh }} chapter='framework' Diagram={MemoryDiagram} diagramAfterSection={1} number={2} previous='/framework' next='/framework/workflow' />
}
