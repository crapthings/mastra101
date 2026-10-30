import { Lesson } from './lesson'
import zh from '@/locales/lessons/observe-outcomes.zh.json'

// 按需加载追踪与指标章节的中文内容及独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='observability' number={4} previous='/observability/context' next='/observability/logs' />
}
