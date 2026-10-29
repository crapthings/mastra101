import { AgentProcessorStagesDiagram } from '@/diagrams/agent-processor-stages'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/agent-processors.zh.json'

// 按需加载智能体章节的中文内容与对应示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='agents' number={8} previous='/agents/streaming' next='/agents/guardrails' Diagram={AgentProcessorStagesDiagram} diagramAfterSection={1} />
}
