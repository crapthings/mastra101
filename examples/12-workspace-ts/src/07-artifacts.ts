import { Workspace, LocalFilesystem } from '@mastra/core/workspace'
import { resolve } from 'node:path'
import { createHash } from 'node:crypto'

// 两次进程使用同一文件位置，用于核对产物是否保留。
const workspace = new Workspace({ filesystem: new LocalFilesystem({ basePath: resolve('lab/07-artifacts') }) })
// 写入与读取分开运行，避免把进程内对象当成文件持久化。
const mode = process.argv[2] || '读取'
if (!['写入', '读取'].includes(mode)) throw new Error('请使用“写入”或“读取”。')
await workspace.init()
try {
  if (mode === '写入') {
    const content = '# 活动准备清单\n\n- 南门入场\n- 带好预约码\n'
    await workspace.filesystem.writeFile('output/checklist.md', content)
    await workspace.filesystem.writeFile('output/manifest.json', JSON.stringify({
      path: 'output/checklist.md', source: '已确认教学资料', status: '已生成，待确认',
      sha256: createHash('sha256').update(content).digest('hex')
    }, null, 2))
  }
  const manifest = JSON.parse(await workspace.filesystem.readFile('output/manifest.json', { encoding: 'utf8' }))
  const content = await workspace.filesystem.readFile(manifest.path, { encoding: 'utf8' })
  console.dir({ manifest, content, matches: createHash('sha256').update(content).digest('hex') === manifest.sha256 })
} finally {
  await workspace.destroy()
}
