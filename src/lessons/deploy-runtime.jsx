import { DeploymentUnitsDiagram } from '@/diagrams/deployment-units'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/deploy-runtime.zh.json'

// 按需加载部署与运行章节的中文内容和可验证示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='deployment' number={1} previous='/auth/scope' next='/deployment/config' Diagram={DeploymentUnitsDiagram} diagramAfterSection={1} />
}
