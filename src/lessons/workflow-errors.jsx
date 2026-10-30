import { Lesson } from './lesson'
import zh from '@/locales/lessons/workflow-errors.zh.json'

// 按需加载工作流章节的中文内容与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='workflows' number={7} previous='/workflows/resume' next='/workflows/agents' />
}
