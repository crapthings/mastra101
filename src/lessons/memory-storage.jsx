import { Lesson } from './lesson'
import zh from '@/locales/lessons/memory-storage.zh.json'

// 按需加载记忆章节的中文内容与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='memory' number={8} previous='/memory/observational' next='/memory/review' />
}
