import { Lesson } from './lesson'
import { AgentGuardrailsDiagram } from '@/diagrams/agent-guardrails'
import zh from '@/locales/lessons/agent-guardrails.zh.json'

// 按需加载智能体章节的中文内容与对应示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='agents' number={9} previous='/agents/processors' next='/agents/recovery' Diagram={AgentGuardrailsDiagram} diagramAfterSection={2} />
}
