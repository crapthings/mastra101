import { LocalSandbox } from '@mastra/core/workspace'
import { resolve } from 'node:path'
import { readFile, writeFile } from 'node:fs/promises'

// 只执行本例提供的固定代码，输出文件写在本节工作目录。
const sandbox = new LocalSandbox({ workingDirectory: resolve('lab/04-code') })
try {
  await sandbox.start()
  await writeFile(resolve(sandbox.workingDirectory, 'registrations.json'), JSON.stringify([{ status: '有效' }, { status: '有效' }, { status: '已取消' }]))
  const script = [
    'const {readFile,writeFile}=await import("node:fs/promises")',
    'const records=JSON.parse(await readFile("registrations.json","utf8"))',
    'const valid=records.filter(record=>record.status==="有效").length',
    'await writeFile("summary.json",JSON.stringify({valid,capacity:20,remaining:20-valid}))',
    'console.log("教学汇总文件已写入")'
  ].join('\n')
  const result = await sandbox.executeCommand(process.execPath, ['--input-type=module', '-e', script])
  console.dir(result)
  if (result.success) console.log('实际产物：', JSON.parse(await readFile(resolve(sandbox.workingDirectory, 'summary.json'), 'utf8')))
} finally {
  await sandbox.destroy()
}
