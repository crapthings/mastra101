import { SubagentResultFlowDiagram } from '@/diagrams/subagent-result-flow'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/subagent-results.zh.json'

// 按需加载子智能体章节的中文内容与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='subagents' Diagram={SubagentResultFlowDiagram} diagramAfterSection={1} number={4} previous='/subagents/context' next='/subagents/hooks' />
}
