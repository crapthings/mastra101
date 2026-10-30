import { Lesson } from './lesson'
import zh from '@/locales/lessons/deploy-health.zh.json'

// 按需加载部署与运行章节的中文内容和可验证示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='deployment' number={6} previous='/deployment/workers' next='/deployment/shutdown' />
}
