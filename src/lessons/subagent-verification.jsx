import { Lesson } from './lesson'
import zh from '@/locales/lessons/subagent-verification.zh.json'

// 按需加载子智能体章节的中文内容与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='subagents' number={8} previous='/subagents/memory' next='/connections' />
}
