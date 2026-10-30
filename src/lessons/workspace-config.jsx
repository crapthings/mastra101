import { WorkspaceCapabilitiesDiagram } from '@/diagrams/workspace-capabilities'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/workspace-config.zh.json'

// 按需加载工作区章节的中文内容与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='workspace' number={1} previous='/skills/review' next='/workspace/paths' Diagram={WorkspaceCapabilitiesDiagram} diagramAfterSection={1} />
}
