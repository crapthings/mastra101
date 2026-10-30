import { MDocument } from '@mastra/rag'
import { loadDocuments, prepareChunks } from './documents.js'

// 对照固定长度切分与标题切分，观察条件和来源是否保留。
const documents = await loadDocuments()
// 小尺寸仅用于观察边界，不作为通用参数建议。
const recursive = await MDocument.fromMarkdown(documents[1].text).chunk({ strategy: 'recursive', maxSize: 70, overlap: 15 })
console.table(recursive.map(chunk => ({ text: chunk.text })))
// 实际流程使用带标题元数据的片段。
const chunks = await prepareChunks()
console.table(chunks.filter(chunk => chunk.metadata.docId === 'lodging-a' && chunk.metadata.active).map(chunk => ({ id: chunk.id, section: chunk.metadata.section, text: chunk.text })))
