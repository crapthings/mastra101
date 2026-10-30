import { LocalSandbox } from '@mastra/core/workspace'
import { resolve } from 'node:path'

// LocalSandbox 默认在宿主进程权限下运行，本例只执行固定教学命令。
const sandbox = new LocalSandbox({ workingDirectory: resolve('lab/01-runtime'), timeout: 5000 })
try {
  console.log('启动结果：', await sandbox.start())
  console.log('执行位置：', sandbox.workingDirectory)
  console.dir(await sandbox.executeCommand(process.execPath, ['-e', 'console.log("活动处理环境已启动"); console.log(process.cwd())']))
} finally {
  await sandbox.destroy()
}
