import { PromptOutputDiagram } from '@/diagrams/prompt-output'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/input-output.zh.json'

// 按需加载提示词章节中的一节中文内容。
export function Component () {
  return <Lesson resources={{ zh }} chapter='prompts' Diagram={PromptOutputDiagram} diagramAfterSection={6} number={8} previous='/prompts/structured-input' next='/prompts/markers' />
}
