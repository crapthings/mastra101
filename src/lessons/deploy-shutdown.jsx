import { DeploymentShutdownDiagram } from '@/diagrams/deployment-shutdown'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/deploy-shutdown.zh.json'

// 按需加载部署与运行章节的中文内容和可验证示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='deployment' number={7} previous='/deployment/health' next='/deployment/release' Diagram={DeploymentShutdownDiagram} diagramAfterSection={0} />
}
