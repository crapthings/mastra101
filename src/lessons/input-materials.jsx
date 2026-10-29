import { Lesson } from './lesson'
import zh from '@/locales/lessons/input-materials.zh.json'

// 按需加载提示词章节中的一节中文内容。
export function Component () {
  return <Lesson resources={{ zh }} chapter='prompts' number={6} previous='/prompts/tone' next='/prompts/structured-input' />
}
