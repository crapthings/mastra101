import { createIndex } from './index.ts'
import { embeddingModel } from './embedding.ts'

// 核对真实索引状态，并删除已失效制度的一个片段。
const index = await createIndex()
try {
  const before = await index.store.describeIndex({ indexName: index.indexName })
  const chunk = index.chunks[0]
  await index.store.upsert({ indexName: index.indexName, ids: [chunk.id], vectors: [index.vectors[0]], metadata: [{ ...chunk.metadata, embeddingModel }] })
  const repeated = await index.store.describeIndex({ indexName: index.indexName })
  console.log('同一片段 id 再写入后的数量：', repeated.count)
  await index.store.deleteVector({ indexName: index.indexName, id: chunk.id })
  const after = await index.store.describeIndex({ indexName: index.indexName })
  console.log('入库片段数：', index.chunks.length, '索引状态：', before)
  console.log('删除一个旧版片段后：', after)
} finally { await index.store.close() }
