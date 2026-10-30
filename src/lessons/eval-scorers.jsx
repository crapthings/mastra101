import { EvalScorerPipelineDiagram } from '@/diagrams/eval-scorer-pipeline'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/eval-scorers.zh.json'

// 按需加载评估章节的中文内容、图示与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='evals' number={3} previous='/evals/checks' next='/evals/judges' Diagram={EvalScorerPipelineDiagram} diagramAfterSection={1} />
}
