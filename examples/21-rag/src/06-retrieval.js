import { createIndex, retrieve } from './index.js'

// 对同一问题比较两个团队，以及完全没有资料的范围。
const index = await createIndex()
try {
  for (const teamId of ['team-a', 'team-b', 'team-c']) {
    const hits = await retrieve(index, '去北京住酒店一晚能报多少？', teamId)
    console.log('当前团队：', teamId)
    console.table(hits.map(hit => ({ id: hit.id, score: hit.score, teamId: hit.metadata.teamId, active: hit.metadata.active, text: hit.metadata.text })))
  }
} finally { await index.store.close() }
