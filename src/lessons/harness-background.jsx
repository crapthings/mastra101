import { Lesson } from './lesson'
import zh from '@/locales/lessons/harness-background.zh.json'

// 按需加载持续执行章节的中文内容、图示与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='harness' number={5} previous='/harness/goals' next='/harness/schedules' />
}
