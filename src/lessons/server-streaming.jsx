import { ServerStreamEventsDiagram } from '@/diagrams/server-stream-events'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/server-streaming.zh.json'

// 按需加载服务接口章节的中文内容、图示与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='server' number={5} previous='/server/context' next='/server/workflows' Diagram={ServerStreamEventsDiagram} diagramAfterSection={1} />
}
