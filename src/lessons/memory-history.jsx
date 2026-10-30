import { MemoryHistoryWindowDiagram } from '@/diagrams/memory-history-window'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/memory-history.zh.json'

// 按需加载记忆章节的中文内容与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='memory' number={3} previous='/memory/threads' next='/memory/working' Diagram={MemoryHistoryWindowDiagram} diagramAfterSection={0} />
}
