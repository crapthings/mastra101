import { AgentStepBudgetDiagram } from '@/diagrams/agent-step-budget'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/agent-run-control.zh.json'

// 按需加载智能体章节的中文内容与对应示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='agents' number={5} previous='/agents/tools' next='/agents/structured-output' Diagram={AgentStepBudgetDiagram} diagramAfterSection={0} />
}
