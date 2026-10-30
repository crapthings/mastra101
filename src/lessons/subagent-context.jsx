import { SubagentContextFlowDiagram } from '@/diagrams/subagent-context-flow'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/subagent-context.zh.json'

// 按需加载子智能体章节的中文内容与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='subagents' Diagram={SubagentContextFlowDiagram} diagramAfterSection={1} number={3} previous='/subagents/description' next='/subagents/results' />
}
