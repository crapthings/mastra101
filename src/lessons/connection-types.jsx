import { ConnectionRequestPathsDiagram } from '@/diagrams/connection-request-paths'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/connection-types.zh.json'

// 按需加载外部连接章节的中文内容与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='connections' Diagram={ConnectionRequestPathsDiagram} diagramAfterSection={1} number={1} previous='/subagents/review' next='/connections/mcp' />
}
