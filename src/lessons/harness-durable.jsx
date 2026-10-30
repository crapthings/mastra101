import { Lesson } from './lesson'
import zh from '@/locales/lessons/harness-durable.zh.json'

// 按需加载持续执行的概念、图示与对应练习。
export function Component () {
  return <Lesson resources={{ zh }} chapter='harness' number={2} previous='/harness' next='/harness/observe' />
}
