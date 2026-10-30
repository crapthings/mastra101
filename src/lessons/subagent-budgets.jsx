import { SubagentBudgetFlowDiagram } from '@/diagrams/subagent-budget-flow'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/subagent-budgets.zh.json'

// 按需加载子智能体章节的中文内容与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='subagents' Diagram={SubagentBudgetFlowDiagram} diagramAfterSection={1} number={6} previous='/subagents/hooks' next='/subagents/memory' />
}
