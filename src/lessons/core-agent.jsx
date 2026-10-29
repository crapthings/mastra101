import { CoreRunDiagram } from '@/diagrams/core-run'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/core-agent.zh.json'

// 按需加载核心组件章节中的一节中文内容。
export function Component () {
  return <Lesson resources={{ zh }} chapter='core' Diagram={CoreRunDiagram} diagramAfterSection={2} number={1} previous='/agent/verify' next='/core/tools' />
}
