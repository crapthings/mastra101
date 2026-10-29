import { Lesson } from './lesson'
import zh from '@/locales/lessons/task-state.zh.json'

// This route loads one framework concept on demand.
export function Component () {
  return <Lesson resources={{ zh }} chapter='framework' number={1} previous='/llm/loop' next='/framework/memory' />
}
