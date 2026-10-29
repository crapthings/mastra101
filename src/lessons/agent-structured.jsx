import { Lesson } from './lesson'
import zh from '@/locales/lessons/agent-structured.zh.json'
import { AgentOutputContractDiagram } from '@/diagrams/agent-output-contract'

// 按需加载智能体章节的中文内容与对应示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='agents' number={6} previous='/agents/control' next='/agents/streaming' Diagram={AgentOutputContractDiagram} diagramAfterSection={1} />
}
