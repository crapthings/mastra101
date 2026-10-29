import { ResultEvidenceDiagram } from '@/diagrams/result-evidence'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/execution.zh.json'

// This route loads one step of the Chinese Get Started tutorial.
export function Component () {
  return <Lesson resources={{ zh }} chapter='agent' Diagram={ResultEvidenceDiagram} diagramAfterSection={0} number={5} previous='/agent/tool' next='/agent/verify' />
}
