import { Lesson } from './lesson'
import zh from '@/locales/lessons/input-markers.zh.json'
import { PromptCheckpointDiagram } from '@/diagrams/prompt-checkpoint'

// 按需加载语义标记协议与解析边界的中文内容。
export function Component () {
  return <Lesson resources={{ zh }} chapter='prompts' number={9} previous='/prompts/structured-output' next='/prompts/iteration' Diagram={PromptCheckpointDiagram} diagramAfterSection={6} />
}
