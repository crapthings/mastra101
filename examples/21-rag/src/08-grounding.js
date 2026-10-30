import { createIndex, retrieve } from './index.js'
import { rankCandidates } from './ranking.js'
import { answerQuestion } from './answer.js'

// 从原文检索到最终引用，保留资料不足的正常交付路径。
const index = await createIndex()
try {
  const question = '甲团队到北京出差，住宿能报多少，超出怎么办？'
  const candidates = await retrieve(index, question, 'team-a')
  const ranked = await rankCandidates(question, candidates)
  const answer = await answerQuestion(question, ranked.map(hit => hit.result))
  console.log('回答：', answer)
  console.table(answer.citations.map(id => {
    const hit = ranked.find(item => item.result.id === id).result
    return { id, source: hit.metadata.source, version: hit.metadata.version, section: hit.metadata.section }
  }))
  console.log('无资料范围：', await answerQuestion(question, await retrieve(index, question, 'team-c')))
} finally { await index.store.close() }
