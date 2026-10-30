import { MemoryContextFlowDiagram } from '@/diagrams/memory-context-flow'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/memory-config.zh.json'

// 按需加载记忆章节的中文内容与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='memory' number={1} previous='/agents/review' next='/memory/threads' Diagram={MemoryContextFlowDiagram} diagramAfterSection={1} />
}
