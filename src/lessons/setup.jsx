import { ExampleFilesDiagram } from '@/diagrams/example-files'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/setup.zh.json'

// This route loads one step of the Chinese Get Started tutorial.
export function Component () {
  return <Lesson resources={{ zh }} chapter='agent' Diagram={ExampleFilesDiagram} diagramAfterSection={3} number={2} previous='/agent/providers' next='/agent/first' />
}
