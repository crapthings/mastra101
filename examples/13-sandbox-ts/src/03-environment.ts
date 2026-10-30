import { LocalSandbox } from '@mastra/core/workspace'
import { resolve } from 'node:path'
import { writeFile } from 'node:fs/promises'
import { z } from 'zod'

// 固定两种路径，观察本进程能执行 Node 不等于任意依赖都已存在。
const mode = z.enum(['正常', '缺少依赖']).parse(process.argv[2] || '正常')
// 工作目录决定脚本里相对文件的读取位置。
const sandbox = new LocalSandbox({ workingDirectory: resolve('lab/03-environment') })
try {
  await sandbox.start()
  await writeFile(resolve(sandbox.workingDirectory, 'input.json'), JSON.stringify({ title: '阅读分享会', venue: '南门' }))
  const script = mode === '缺少依赖'
    ? 'await import("mastra101-teaching-missing-dependency")'
    : 'const {readFile}=await import("node:fs/promises"); const data=JSON.parse(await readFile("input.json","utf8")); console.log(JSON.stringify({data,style:process.env.ACTIVITY_STYLE,node:process.version}))'
  const result = await sandbox.executeCommand(process.execPath, ['--input-type=module', '-e', script], { env: { ACTIVITY_STYLE: '简短' } })
  console.dir(result, { depth: null })
} finally {
  await sandbox.destroy()
}
