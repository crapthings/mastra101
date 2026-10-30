import { Lesson } from './lesson'
import zh from '@/locales/lessons/connection-runtimes.zh.json'

// 按需加载外部连接章节的中文内容与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='connections' number={9} next='/observability' previous='/connections/a2a' />
}
