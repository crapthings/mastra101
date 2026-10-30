import { Lesson } from './lesson'
import zh from '@/locales/lessons/rag-embedding.zh.json'

// 按需加载检索增强生成章节的中文内容、图示与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='rag' number={4} previous='/rag/chunking' next='/rag/index' />
}
