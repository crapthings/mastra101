import { LocalSandbox } from '@mastra/core/workspace'
import { resolve } from 'node:path'

// 短超时只作用于这次命令，后台进程则显式启动与停止。
const sandbox = new LocalSandbox({ workingDirectory: resolve('lab/05-processes'), timeout: 5000 })
try {
  await sandbox.start()
  const timed = await sandbox.executeCommand(process.execPath, ['-e', 'setTimeout(()=>console.log("过晚的教学输出"),1500)'], { timeout: 100 })
  console.dir({ timedOut: timed.timedOut, success: timed.success, exitCode: timed.exitCode })
  // 固定的后台教学进程不访问网络，停止后等待其真正退出。
  const handle = await sandbox.processes.spawn('node -e "setInterval(() => {}, 1000)"')
  console.log('后台进程标识：', handle.pid)
  console.log('运行中进程数：', (await sandbox.processes.list()).length)
  await sandbox.processes.kill(handle.pid)
  console.dir(await handle.wait())
} finally {
  await sandbox.destroy()
}
