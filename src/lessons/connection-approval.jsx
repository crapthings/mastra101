import { ConnectionApprovalFlowDiagram } from '@/diagrams/connection-approval-flow'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/connection-approval.zh.json'

// 按需加载外部连接章节的中文内容与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='connections' Diagram={ConnectionApprovalFlowDiagram} diagramAfterSection={1} number={6} previous='/connections/credentials' next='/connections/server' />
}
