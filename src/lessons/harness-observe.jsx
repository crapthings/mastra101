import { HarnessReplayDiagram } from '@/diagrams/harness-replay'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/harness-observe.zh.json'

// 按需加载持续执行章节的中文内容、图示与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='harness' number={3} previous='/harness/durable' next='/harness/goals' Diagram={HarnessReplayDiagram} diagramAfterSection={0} />
}
