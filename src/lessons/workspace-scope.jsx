import { WorkspaceResourceScopeDiagram } from '@/diagrams/workspace-resource-scope'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/workspace-scope.zh.json'

// 按需加载工作区章节的中文内容与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='workspace' number={6} previous='/workspace/skills' next='/workspace/artifacts' Diagram={WorkspaceResourceScopeDiagram} diagramAfterSection={1} />
}
