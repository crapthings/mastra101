import { loadDocuments } from './documents.ts'

// 先核对来源、归属与版本，再考虑怎样把原文放入检索系统。
const documents = await loadDocuments()
console.table(documents.map(doc => ({ docId: doc.docId, version: doc.version, teamId: doc.teamId, active: doc.active, source: doc.file })))
console.log('当前住宿原文：', documents.find(doc => doc.file === 'lodging-a-v2.md').text)
