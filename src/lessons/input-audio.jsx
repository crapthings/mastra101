import { AudioPathsDiagram } from '@/diagrams/audio-paths'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/input-audio.zh.json'

// 按需加载模态章节中的一节中文内容。
export function Component () {
  return <Lesson resources={{ zh }} chapter='modalities' Diagram={AudioPathsDiagram} diagramAfterSection={0} number={5} previous='/modalities/image' next='/modalities/video' />
}
