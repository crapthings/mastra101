import { SandboxLifecycleFlowDiagram } from '@/diagrams/sandbox-lifecycle-flow'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/sandbox-lifecycle.zh.json'

// 按需加载沙箱章节的中文内容与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='sandbox' number={7} previous='/sandbox/isolation' next='/subagents' Diagram={SandboxLifecycleFlowDiagram} diagramAfterSection={1} />
}
