import { CoreMemoryDiagram } from '@/diagrams/core-memory'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/core-memory.zh.json'

// 按需加载核心组件章节中的一节中文内容。
export function Component () {
  return <Lesson resources={{ zh }} chapter='core' Diagram={CoreMemoryDiagram} diagramAfterSection={3} number={4} previous='/core/context' next='/core/workflow' />
}
