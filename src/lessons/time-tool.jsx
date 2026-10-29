import { Lesson } from './lesson'
import zh from '@/locales/lessons/time-tool.zh.json'

// This route loads one step of the Chinese Get Started tutorial.
export function Component () {
  return <Lesson resources={{ zh }} chapter='agent' number={4} previous='/agent/first' next='/agent/execution' />
}
