import { ModalityContentDiagram } from '@/diagrams/modality-content'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/input-modalities.zh.json'

// 按需加载模态章节中的一节中文内容。
export function Component () {
  return <Lesson resources={{ zh }} chapter='modalities' Diagram={ModalityContentDiagram} diagramAfterSection={1} number={1} previous='/prompts/iteration' next='/modalities/text' />
}
