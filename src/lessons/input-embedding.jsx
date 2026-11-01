import { EmbeddingSearchDiagram } from '@/diagrams/embedding-search'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/input-embedding.zh.json'

// 按需加载嵌入检索的中文内容与流程图。
export function Component () {
  return <Lesson resources={{ zh }} chapter='modalities' number={10} previous='/modalities/multimodal' next='/modalities/planning' Diagram={EmbeddingSearchDiagram} diagramAfterSection={7} />
}
