import { WorldPredictionDiagram } from '@/diagrams/world-prediction'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/input-world-models.zh.json'

// 按需加载模态章节的能力扩展内容。
export function Component () {
  return <Lesson resources={{ zh }} chapter='modalities' Diagram={WorldPredictionDiagram} diagramAfterSection={2} number={13} previous='/modalities/specialists' next='/agents' />
}
