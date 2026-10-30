import { Lesson } from './lesson'
import zh from '@/locales/lessons/harness-durable.zh.json'

// 按需加载持续执行章节的中文内容、图示与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='harness' number={2} previous='/harness' next='/harness/observe' />
}
