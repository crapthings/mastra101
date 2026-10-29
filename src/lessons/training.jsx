import { TrainingDiagram } from '@/diagrams/training'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/training.zh.json'

// This route loads one Chinese lesson on demand.
export function Component () {
  return <Lesson resources={{ zh }} chapter='llm' Diagram={TrainingDiagram} diagramAfterSection={4} number={2} previous='/llm' next='/llm/messages' />
}
