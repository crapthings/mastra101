import { FrameworkDiagram } from '@/diagrams/framework'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/framework-choice.zh.json'

// This route loads one framework concept on demand.
export function Component () {
  return <Lesson resources={{ zh }} chapter='framework' Diagram={FrameworkDiagram} diagramAfterSection={2} number={6} previous='/framework/quality' next='/framework/mastra' />
}
