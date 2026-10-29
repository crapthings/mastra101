import { Lesson } from './lesson'
import zh from '@/locales/lessons/input-text.zh.json'

// 按需加载模态章节中的一节中文内容。
export function Component () {
  return <Lesson resources={{ zh }} chapter='modalities' number={2} previous='/modalities' next='/modalities/document' />
}
