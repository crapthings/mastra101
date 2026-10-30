import { Lesson } from './lesson'
import zh from '@/locales/lessons/rag-evaluation.zh.json'

// 按需加载检索增强生成章节的中文内容、图示与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='rag' number={9} previous='/rag/grounding' next='/harness' />
}
