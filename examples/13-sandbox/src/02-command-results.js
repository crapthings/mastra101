import { LocalSandbox } from '@mastra/core/workspace'
import { resolve } from 'node:path'
import { z } from 'zod'

// 成功与失败都使用固定代码，观察退出码而不是只看输出文字。
const mode = z.enum(['成功', '失败']).parse(process.argv[2] || '成功')
// 命令参数作为数组传入，不把任意用户文字拼成 shell 命令。
const sandbox = new LocalSandbox({ workingDirectory: resolve('lab/02-results') })
try {
  await sandbox.start()
  const script = mode === '成功' ? 'console.log("教学资料处理完成")' : 'console.log("已经输出部分进度"); console.error("教学输入缺少地点"); process.exitCode = 7'
  const result = await sandbox.executeCommand(process.execPath, ['-e', script])
  console.dir({ success: result.success, exitCode: result.exitCode, stdout: result.stdout, stderr: result.stderr })
} finally {
  await sandbox.destroy()
}
