import { RagPipelineDiagram } from '@/diagrams/rag-pipeline'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/rag-pipeline.zh.json'

// 按需加载检索增强生成章节的中文内容、图示与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='rag' number={1} previous='/deployment/release' next='/rag/documents' Diagram={RagPipelineDiagram} diagramAfterSection={1} />
}
