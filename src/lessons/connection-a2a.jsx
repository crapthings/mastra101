import { ConnectionA2AFlowDiagram } from '@/diagrams/connection-a2a-flow'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/connection-a2a.zh.json'

// 按需加载外部连接章节的中文内容与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='connections' Diagram={ConnectionA2AFlowDiagram} diagramAfterSection={3} number={8} previous='/connections/server' next='/connections/runtimes' />
}
