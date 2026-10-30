import { Lesson } from './lesson'
import zh from '@/locales/lessons/eval-gates.zh.json'

// 按需加载评估章节的中文内容、图示与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='evals' number={7} previous='/evals/batch' next='/evals/live' />
}
