import { AgentRetryLayersDiagram } from '@/diagrams/agent-retry-layers'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/agent-recovery.zh.json'

// 按需加载智能体章节的中文内容与对应示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='agents' number={10} previous='/agents/guardrails' next='/agents/approval' Diagram={AgentRetryLayersDiagram} diagramAfterSection={1} />
}
