import { AttentionOmissionDiagram } from '@/diagrams/attention-omission'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/attention.zh.json'

// 从信息遗漏认识注意力机制，并衔接下一节的事实核对。
export function Component () {
  return <Lesson resources={{ zh }} chapter='llm' Diagram={AttentionOmissionDiagram} diagramAfterSection={0} number={5} previous='/llm/context' next='/llm/hallucination' />
}
