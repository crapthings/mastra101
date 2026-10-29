import { HarnessDiagram } from '@/diagrams/harness'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/harness.zh.json'

// This route loads one framework concept on demand.
export function Component () {
  return <Lesson resources={{ zh }} chapter='framework' Diagram={HarnessDiagram} diagramAfterSection={3} number={4} previous='/framework/workflow' next='/framework/quality' />
}
