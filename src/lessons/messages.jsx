import { Lesson } from './lesson'
import zh from '@/locales/lessons/messages.zh.json'

// This route loads one Chinese lesson on demand.
export function Component () {
  return <Lesson resources={{ zh }} chapter='llm' number={3} previous='/llm/training' next='/llm/context' />
}
