import { VideoStoryboardDiagram } from '@/diagrams/video-storyboard'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/input-video.zh.json'

// 按需加载模态章节中的一节中文内容。
export function Component () {
  return <Lesson resources={{ zh }} chapter='modalities' Diagram={VideoStoryboardDiagram} diagramAfterSection={2} number={6} previous='/modalities/audio' next='/modalities/combined' />
}
