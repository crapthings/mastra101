import { Lesson } from './lesson'
import zh from '@/locales/lessons/knowledge.zh.json'

// This route loads one Chinese lesson on demand.
export function Component () {
  return <Lesson resources={{ zh }} chapter='llm' number={7} previous='/llm/hallucination' next='/llm/tools' />
}
