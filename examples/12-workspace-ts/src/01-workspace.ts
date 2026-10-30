import { Workspace, LocalFilesystem } from '@mastra/core/workspace'
import { resolve } from 'node:path'

// 工作区组织文件能力，本例没有配置任何命令执行环境。
const workspace = new Workspace({ filesystem: new LocalFilesystem({ basePath: resolve('lab/01-workspace') }) })
await workspace.init()
try {
  await workspace.filesystem.writeFile('activity.txt', '主办方资料：阅读分享会周六两点开始，南门入场。')
  console.log(await workspace.filesystem.readFile('activity.txt', { encoding: 'utf8' }))
  console.log('配置了执行环境：', workspace.hasSandboxConfig())
} finally {
  await workspace.destroy()
}
