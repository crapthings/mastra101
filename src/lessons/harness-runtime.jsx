import { HarnessRuntimeDiagram } from '@/diagrams/harness-runtime'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/harness-runtime.zh.json'

// 按需加载持续执行章节的中文内容、图示与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='harness' number={1} previous='/rag/evaluation' next='/harness/durable' Diagram={HarnessRuntimeDiagram} diagramAfterSection={1} />
}
