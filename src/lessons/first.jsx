import { Lesson } from './lesson'
import zh from '@/locales/lessons/first.zh.json'

// This route loads one step of the Chinese Get Started tutorial.
export function Component () {
  return <Lesson resources={{ zh }} chapter='agent' number={3} previous='/agent/setup' next='/agent/tool' />
}
