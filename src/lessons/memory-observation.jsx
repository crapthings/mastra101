import { MemoryObservationFlowDiagram } from '@/diagrams/memory-observation-flow'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/memory-observation.zh.json'

// 按需加载记忆章节的中文内容与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='memory' number={7} previous='/memory/context' next='/memory/storage' Diagram={MemoryObservationFlowDiagram} diagramAfterSection={1} />
}
