import { Lesson } from './lesson'
import zh from '@/locales/lessons/subagent-memory.zh.json'

// 按需加载子智能体章节的中文内容与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='subagents' number={7} previous='/subagents/budgets' next='/subagents/review' />
}
