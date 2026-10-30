import { Workspace, LocalFilesystem } from '@mastra/core/workspace'
import { resolve } from 'node:path'

// 读写实例只操作本节教学目录。
const writable = new LocalFilesystem({ basePath: resolve('lab/03-files') })
await writable.init()
await writable.writeFile('draft.txt', '地点待确认。')
// 先读回旧内容，再用明确内容覆盖本次草稿。
const before = await writable.readFile('draft.txt', { encoding: 'utf8' })
await writable.writeFile('draft.txt', '主办方已确认南门入场。')
console.dir({ before, after: await writable.readFile('draft.txt', { encoding: 'utf8' }) })
// 同一路径的只读接口可阅读资料，但不能通过该接口写入。
const readOnly = new LocalFilesystem({ basePath: resolve('lab/03-files'), readOnly: true })
console.log('只读接口：', await readOnly.readFile('draft.txt', { encoding: 'utf8' }))
try {
  await readOnly.writeFile('draft.txt', '不应写入的内容。')
} catch (error) {
  console.log('只读写入被拒绝：', error instanceof Error ? error.message : error)
}
