import { Lesson } from './lesson'
import zh from '@/locales/lessons/core-evaluation.zh.json'

// 按需加载核心组件章节中的一节中文内容。
export function Component () {
  return <Lesson resources={{ zh }} chapter='core' number={8} previous='/core/skills' next='/prompts' />
}
