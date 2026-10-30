import { ObservePipelineDiagram } from '@/diagrams/observe-pipeline'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/observe-config.zh.json'

// 按需加载追踪与指标章节的中文内容及独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='observability' number={1} previous='/connections/runtimes' next='/observability/spans' Diagram={ObservePipelineDiagram} diagramAfterSection={1} />
}
