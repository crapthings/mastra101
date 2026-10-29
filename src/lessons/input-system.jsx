import { PromptPartsDiagram } from '@/diagrams/prompt-parts'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/input-system.zh.json'

// 按需加载提示词章节中的一节中文内容。
export function Component () {
  return <Lesson resources={{ zh }} chapter='prompts' Diagram={PromptPartsDiagram} diagramAfterSection={2} number={2} previous='/prompts' next='/prompts/user' />
}
