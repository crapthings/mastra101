import { Workspace, LocalFilesystem } from '@mastra/core/workspace'
import { resolve } from 'node:path'

// BM25 在本地构建词项索引，不调用嵌入模型。
const workspace = new Workspace({ filesystem: new LocalFilesystem({ basePath: resolve('lab/04-search') }), bm25: true })
await workspace.init()
try {
  await workspace.filesystem.writeFile('notice.txt', '入场：南门。携带：预约码。')
  await workspace.index('notice.txt', '入场：南门。携带：预约码。')
  console.log('初次索引：', await workspace.search('预约码'))
  // 文件写入和索引更新分开观察，避免把旧索引误当成新文件。
  await workspace.filesystem.writeFile('notice.txt', '入场：东门。携带：预约码。')
  console.log('尚未更新的索引：', await workspace.search('预约码'))
  await workspace.index('notice.txt', '入场：东门。携带：预约码。')
  console.log('更新后的索引：', await workspace.search('预约码'))
} finally {
  await workspace.destroy()
}
