import { Lesson } from './lesson'
import zh from '@/locales/lessons/agent-tool-loop.zh.json'

// 按需加载智能体章节的中文内容与对应示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='agents' number={4} previous='/agents/request-context' next='/agents/control' />
}
