import { PromptToneDiagram } from '@/diagrams/prompt-tone'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/input-tone.zh.json'

// 按需加载提示词章节中的一节中文内容。
export function Component () {
  return <Lesson resources={{ zh }} chapter='prompts' Diagram={PromptToneDiagram} diagramAfterSection={2} number={5} previous='/prompts/roles' next='/prompts/materials' />
}
