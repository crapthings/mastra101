import { EvalEvidenceDiagram } from '@/diagrams/eval-evidence'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/eval-criteria.zh.json'

// 按需加载评估章节的中文内容、图示与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='evals' number={1} previous='/observability/diagnosis' next='/evals/checks' Diagram={EvalEvidenceDiagram} diagramAfterSection={1} />
}
