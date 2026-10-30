import { MemorySemanticFlowDiagram } from '@/diagrams/memory-semantic-flow'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/memory-recall.zh.json'

// 按需加载记忆章节的中文内容与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='memory' number={5} previous='/memory/working' next='/memory/context' Diagram={MemorySemanticFlowDiagram} diagramAfterSection={1} />
}
