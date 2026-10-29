import { Lesson } from './lesson'
import zh from '@/locales/lessons/hallucination.zh.json'

// This route loads one Chinese lesson on demand.
export function Component () {
  return <Lesson resources={{ zh }} chapter='llm' number={6} previous='/llm/attention' next='/llm/knowledge' />
}
