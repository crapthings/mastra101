import { Lesson } from './lesson'
import zh from '@/locales/lessons/core-tools.zh.json'

// 按需加载核心组件章节中的一节中文内容。
export function Component () {
  return <Lesson resources={{ zh }} chapter='core' number={2} previous='/core' next='/core/context' />
}
