import { MemoryThreadScopeDiagram } from '@/diagrams/memory-thread-scope'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/memory-identity.zh.json'

// 按需加载记忆章节的中文内容与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='memory' number={2} previous='/memory' next='/memory/history' Diagram={MemoryThreadScopeDiagram} diagramAfterSection={1} />
}
