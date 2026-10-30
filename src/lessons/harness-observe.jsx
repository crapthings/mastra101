import { HarnessReplayDiagram } from '@/diagrams/harness-replay'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/harness-observe.zh.json'

// 按需加载持续执行的概念、图示与对应练习。
export function Component () {
  return <Lesson resources={{ zh }} chapter='harness' number={3} previous='/harness/durable' next='/harness/thread-streams' Diagram={HarnessReplayDiagram} diagramAfterSection={0} />
}
