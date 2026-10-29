import { Lesson } from './lesson'
import zh from '@/locales/lessons/input-styles.zh.json'

// 按需加载提示词章节中的一节中文内容。
export function Component () {
  return <Lesson resources={{ zh }} chapter='prompts' number={7} previous='/prompts/materials' next='/prompts/structured-output' />
}
