import { HarnessCoordinationDiagram } from '@/diagrams/harness-coordination'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/harness-coordination.zh.json'

// 按需加载持续执行的概念、图示与对应练习。
export function Component () {
  return <Lesson resources={{ zh }} chapter='harness' number={14} previous='/harness/controller' next='/harness/recovery' Diagram={HarnessCoordinationDiagram} diagramAfterSection={1} />
}
