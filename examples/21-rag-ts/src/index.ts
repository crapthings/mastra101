import { LibSQLVector } from '@mastra/libsql'
import { prepareChunks } from './documents.ts'
import { embedTexts, embeddingModel } from './embedding.ts'

// 每个入口独立建立内存索引；真实入库与检索使用同一种 Embedding 配置。
export async function createIndex () {
  const chunks = await prepareChunks()
  const vectors = await embedTexts(chunks.map(chunk => chunk.text))
  const store = new LibSQLVector({ id: 'travel-vectors', url: ':memory:' })
  const indexName = 'travel_policy'
  try {
    await store.createIndex({ indexName, dimension: vectors[0].length })
    await store.upsert({ indexName, ids: chunks.map(c => c.id), vectors, metadata: chunks.map(c => ({ ...c.metadata, embeddingModel })) })
    return { store, indexName, chunks, vectors }
  } catch (error) { await store.close(); throw error }
}

// 团队范围来自调用侧已确认的身份，检索时同时排除失效制度。
export async function retrieve (index, question, teamId) {
  const [queryVector] = await embedTexts([question])
  return index.store.query({ indexName: index.indexName, queryVector, topK: 4, filter: { teamId, active: true } })
}
