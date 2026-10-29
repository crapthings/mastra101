import { Lesson } from './lesson'
import zh from '@/locales/lessons/agent-approval.zh.json'
import { AgentApprovalFlowDiagram } from '@/diagrams/agent-approval-flow'

// 按需加载智能体章节的中文内容与对应示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='agents' number={11} previous='/agents/recovery' next='/agents/code-mode' Diagram={AgentApprovalFlowDiagram} diagramAfterSection={1} />
}
