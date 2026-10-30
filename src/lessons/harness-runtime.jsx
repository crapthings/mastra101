import { HarnessRuntimeDiagram } from '@/diagrams/harness-runtime'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/harness-runtime.zh.json'

// 按需加载持续执行的概念、图示与对应练习。
export function Component () {
  return <Lesson resources={{ zh }} chapter='harness' number={1} previous='/rag/evaluation' next='/harness/durable' Diagram={HarnessRuntimeDiagram} diagramAfterSection={1} />
}
