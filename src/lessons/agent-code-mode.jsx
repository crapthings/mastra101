import { Lesson } from './lesson'
import zh from '@/locales/lessons/agent-code-mode.zh.json'

// 按需加载智能体章节的中文内容与对应示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='agents' number={12} previous='/agents/approval' next='/agents/review' />
}
