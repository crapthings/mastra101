import { ObserveDiagnosisDiagram } from '@/diagrams/observe-diagnosis'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/observe-diagnosis.zh.json'

// 按需加载追踪与指标章节的中文内容及独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='observability' number={8} next='/evals' previous='/observability/metrics' Diagram={ObserveDiagnosisDiagram} diagramAfterSection={0} />
}
