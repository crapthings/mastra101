import { createIndex, retrieve } from './index.ts'
import { rankCandidates } from './ranking.ts'

// 重排只改变已召回候选的顺序，不能找回未进入候选的资料。
const index = await createIndex()
try {
  const question = '甲团队到北京住宿，上限是多少，超出要怎么办？'
  const candidates = await retrieve(index, question, 'team-a')
  const ranked = await rankCandidates(question, candidates)
  console.table(ranked.map(hit => ({ id: hit.result.id, score: hit.score, details: JSON.stringify(hit.details), text: hit.result.metadata.text })))
} finally { await index.store.close() }
