import { Lesson } from './lesson'
import zh from '@/locales/lessons/troubleshooting.zh.json'

// This route loads one step of the Chinese Get Started tutorial.
export function Component () {
  return <Lesson resources={{ zh }} chapter='agent' number={6} previous='/agent/execution' next='/core' />
}
