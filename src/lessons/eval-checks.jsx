import { Lesson } from './lesson'
import zh from '@/locales/lessons/eval-checks.zh.json'

// 按需加载评估章节的中文内容、图示与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='evals' number={2} previous='/evals' next='/evals/scorers' />
}
