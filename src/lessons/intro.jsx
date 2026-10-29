import { ModelDiagram } from '@/diagrams/model'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/intro.zh.json'

// This route loads one Chinese lesson on demand.
export function Component () {
  return <Lesson resources={{ zh }} chapter='llm' Diagram={ModelDiagram} diagramAfterSection={2} number={1} next='/llm/training' />
}
