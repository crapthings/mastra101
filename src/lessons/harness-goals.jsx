import { HarnessGoalDiagram } from '@/diagrams/harness-goal'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/harness-goals.zh.json'

// 按需加载持续执行的概念、图示与对应练习。
export function Component () {
  return <Lesson resources={{ zh }} chapter='harness' number={7} previous='/harness/state' next='/harness/tasks' Diagram={HarnessGoalDiagram} diagramAfterSection={2} />
}
