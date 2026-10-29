import { ImageDetailDiagram } from '@/diagrams/image-detail'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/input-image.zh.json'

// 按需加载模态章节中的一节中文内容。
export function Component () {
  return <Lesson resources={{ zh }} chapter='modalities' Diagram={ImageDetailDiagram} diagramAfterSection={4} number={4} previous='/modalities/document' next='/modalities/audio' />
}
