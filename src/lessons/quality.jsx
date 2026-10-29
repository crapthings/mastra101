import { Lesson } from './lesson'
import zh from '@/locales/lessons/quality.zh.json'

// This route loads one framework concept on demand.
export function Component () {
  return <Lesson resources={{ zh }} chapter='framework' number={5} previous='/framework/harness' next='/framework/organization' />
}
