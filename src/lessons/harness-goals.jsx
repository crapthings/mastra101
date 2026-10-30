import { HarnessGoalDiagram } from '@/diagrams/harness-goal'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/harness-goals.zh.json'

// 按需加载持续执行章节的中文内容、图示与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='harness' number={4} previous='/harness/observe' next='/harness/background' Diagram={HarnessGoalDiagram} diagramAfterSection={2} />
}
