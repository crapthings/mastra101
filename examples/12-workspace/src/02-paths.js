import { Workspace, LocalFilesystem } from '@mastra/core/workspace'
import { resolve } from 'node:path'

// basePath 是应用宿主上的目录，文件操作中的路径相对这个范围解析。
const filesystem = new LocalFilesystem({ basePath: resolve('lab/02-paths') })
await filesystem.init()
await filesystem.writeFile('docs/notice.txt', '地点更正：阅读分享会改从南门入场。')
console.log('相对路径读取：', await filesystem.readFile('docs/notice.txt', { encoding: 'utf8' }))
console.log('范围内绝对路径读取：', await filesystem.readFile(resolve('lab/02-paths/docs/notice.txt'), { encoding: 'utf8' }))
try {
  await filesystem.readFile('../outside.txt', { encoding: 'utf8' })
} catch (error) {
  console.log('越过配置范围的路径被拒绝：', error instanceof Error ? error.message : error)
}
