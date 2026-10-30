import { StorageRetentionFlowDiagram } from '@/diagrams/storage-retention-flow'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/storage-retention.zh.json'

// 按需加载存储章节的中文内容与本地教学示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='storage' number={7} previous='/storage/composite' next='/workflows' Diagram={StorageRetentionFlowDiagram} diagramAfterSection={1} />
}
