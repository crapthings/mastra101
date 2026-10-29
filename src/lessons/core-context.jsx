import { Lesson } from './lesson'
import zh from '@/locales/lessons/core-context.zh.json'

// 按需加载核心组件章节中的一节中文内容。
export function Component () {
  return <Lesson resources={{ zh }} chapter='core' number={3} previous='/core/tools' next='/core/memory' />
}
