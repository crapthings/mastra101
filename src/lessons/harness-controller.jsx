import { Lesson } from './lesson'
import zh from '@/locales/lessons/harness-controller.zh.json'

// 按需加载持续执行章节的中文内容、图示与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='harness' number={7} previous='/harness/schedules' next='/harness/recovery' />
}
