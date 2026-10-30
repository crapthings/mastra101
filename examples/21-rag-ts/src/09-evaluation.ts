import { createIndex, retrieve } from './index.ts'

// 先评估检索是否找回必要文档，再把生成内容交给独立的质量评估。
const cases = [
  { question: '北京住酒店一晚能报多少？', expectedDoc: 'lodging-a' },
  { question: '高铁允许报什么座位？', expectedDoc: 'transport-a' },
  { question: '出差结束后几天内提交报销？', expectedDoc: 'submission-a' }
]
// 本轮按文档去重统计命中，不把同一文档的多个片段重复计数。
const index = await createIndex()
try {
  let found = 0
  for (const item of cases) {
    const hits = await retrieve(index, item.question, 'team-a')
    const docs = new Set(hits.map(hit => hit.metadata.docId))
    const passed = docs.has(item.expectedDoc)
    if (passed) found++
    console.log('问题：', item.question, '必要文档命中：', passed, '返回文档：', [...docs])
    if (hits.some(hit => hit.metadata.teamId !== 'team-a' || !hit.metadata.active)) throw new Error('检索包含越界或失效资料')
  }
  console.log('当前三个样本的必要文档命中比例：', found / cases.length)
} finally { await index.store.close() }
