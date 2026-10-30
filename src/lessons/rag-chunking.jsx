import { Lesson } from './lesson'
import zh from '@/locales/lessons/rag-chunking.zh.json'

// 按需加载检索增强生成章节的中文内容、图示与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='rag' number={3} previous='/rag/documents' next='/rag/embedding' />
}
