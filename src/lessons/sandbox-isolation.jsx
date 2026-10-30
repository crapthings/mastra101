import { SandboxBoundariesDiagram } from '@/diagrams/sandbox-boundaries'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/sandbox-isolation.zh.json'

// 按需加载沙箱章节的中文内容与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='sandbox' number={6} previous='/sandbox/processes' next='/sandbox/lifecycle' Diagram={SandboxBoundariesDiagram} diagramAfterSection={0} />
}
