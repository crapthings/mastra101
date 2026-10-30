import { HarnessThreadDiagram } from '@/diagrams/harness-thread'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/harness-thread-streams.zh.json'

// 按需加载持续执行的概念、图示与对应练习。
export function Component () {
  return <Lesson resources={{ zh }} chapter='harness' number={4} previous='/harness/observe' next='/harness/signals' Diagram={HarnessThreadDiagram} diagramAfterSection={2} />
}
