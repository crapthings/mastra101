import { AuthDecisionDiagram } from '@/diagrams/auth-decision'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/auth-boundaries.zh.json'

// 按需加载身份与权限章节的中文内容及本地验证示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='auth' number={1} previous='/server/cancellation' next='/auth/provider' Diagram={AuthDecisionDiagram} diagramAfterSection={1} />
}
