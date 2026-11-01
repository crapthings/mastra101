import { Lesson } from './lesson'
import zh from '@/locales/lessons/input-multimodal.zh.json'

// 按需加载模态章节的能力扩展内容。
export function Component () {
  return <Lesson resources={{ zh }} chapter='modalities' number={9} previous='/modalities/generation' next='/agents' />
}
