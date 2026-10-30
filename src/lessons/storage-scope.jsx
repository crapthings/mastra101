import { StorageConfigScopeDiagram } from '@/diagrams/storage-config-scope'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/storage-scope.zh.json'

// 按需加载存储章节的中文内容与本地教学示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='storage' number={2} previous='/storage' next='/storage/domains' Diagram={StorageConfigScopeDiagram} diagramAfterSection={1} />
}
