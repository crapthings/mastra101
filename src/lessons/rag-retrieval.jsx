import { RagScopeDiagram } from '@/diagrams/rag-scope'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/rag-retrieval.zh.json'

// 按需加载检索增强生成章节的中文内容、图示与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='rag' number={6} previous='/rag/index' next='/rag/reranking' Diagram={RagScopeDiagram} diagramAfterSection={2} />
}
