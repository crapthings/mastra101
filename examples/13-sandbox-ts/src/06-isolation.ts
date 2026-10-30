import { LocalSandbox } from '@mastra/core/workspace'
import { resolve } from 'node:path'
import { createServer } from 'node:http'

// 能力检测说明候选原生后端，不代表已经验证全部安全策略。
const detection = LocalSandbox.detectIsolation()
console.dir(detection)
if (!detection.available) {
  console.log('本机没有可用原生隔离后端，本例不降级执行隔离演示。')
} else {
  // 只开放一个本机教学端点，用于观察禁网配置是否影响实际连接。
  const server = createServer((request, response) => response.end('本机教学回执'))
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  if (!address || typeof address === 'string') throw new Error('本地教学端点启动失败。')
  const url = `http://127.0.0.1:${address.port}`
  // 显式启用检测到的原生后端，并配置禁止网络。
  let sandbox
  try {
    sandbox = new LocalSandbox({ workingDirectory: resolve('lab/06-isolation'), isolation: detection.backend, nativeSandbox: { allowNetwork: false } })
    console.log('宿主本机端点：', await fetch(url).then(response => response.text()))
    await sandbox.start()
    const script = `fetch(${JSON.stringify(url)}).then(response=>response.text()).then(text=>console.log(text)).catch(error=>{console.error("教学连接未完成：",error.message);process.exitCode=2})`
    const result = await sandbox.executeCommand(process.execPath, ['-e', script], { timeout: 5000 })
    console.dir({ success: result.success, exitCode: result.exitCode, stdout: result.stdout, stderr: result.stderr })
  } catch (error) {
    console.error('原生隔离演示未完成，不改用无隔离执行：', error instanceof Error ? error.message : error)
  } finally {
    await sandbox?.destroy()
    await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()))
  }
}
