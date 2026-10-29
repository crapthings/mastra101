import { PromptComparisonDiagram } from '@/diagrams/prompt-comparison'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/input-iteration.zh.json'

// 按需加载提示词章节中的一节中文内容。
export function Component () {
  return <Lesson resources={{ zh }} chapter='prompts' Diagram={PromptComparisonDiagram} diagramAfterSection={1} number={10} previous='/prompts/markers' next='/modalities' />
}
