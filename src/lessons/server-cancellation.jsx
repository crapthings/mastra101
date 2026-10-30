import { ServerCancellationDiagram } from '@/diagrams/server-cancellation'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/server-cancellation.zh.json'

// 按需加载服务接口章节的中文内容、图示与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='server' number={9} next='/auth' previous='/server/middleware' Diagram={ServerCancellationDiagram} diagramAfterSection={0} />
}
