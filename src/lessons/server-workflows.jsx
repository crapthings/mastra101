import { Lesson } from './lesson'
import zh from '@/locales/lessons/server-workflows.zh.json'

// 按需加载服务接口章节的中文内容、图示与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='server' number={6} previous='/server/streaming' next='/server/custom' />
}
