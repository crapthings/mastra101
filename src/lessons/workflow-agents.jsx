import { Lesson } from './lesson'
import zh from '@/locales/lessons/workflow-agents.zh.json'

// 按需加载工作流章节的中文内容与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='workflows' number={8} previous='/workflows/errors' next='/skills' />
}
