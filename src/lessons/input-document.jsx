import { DocumentInputDiagram } from '@/diagrams/document-input'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/input-document.zh.json'

// 按需加载模态章节中的一节中文内容。
export function Component () {
  return <Lesson resources={{ zh }} chapter='modalities' Diagram={DocumentInputDiagram} diagramAfterSection={2} number={3} previous='/modalities/text' next='/modalities/image' />
}
