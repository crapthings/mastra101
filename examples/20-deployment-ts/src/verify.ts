import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomBytes } from 'node:crypto'
import { readConfig } from './config.ts'

// 启动独立进程并等待就绪事件，密钥只通过环境变量传入。
async function launch (dataDir, token, version) {
  const env = { ...process.env, HOST: '127.0.0.1', PORT: '0', DATA_DIR: dataDir, API_AUTH_TOKEN: token, APP_VERSION: version }
  for (const name of ['HTTP_PROXY', 'HTTPS_PROXY', 'ALL_PROXY', 'http_proxy', 'https_proxy', 'all_proxy', 'AI_GATEWAY_API_KEY']) delete env[name]
  env.NO_PROXY = '127.0.0.1,localhost'
  env.NODE_USE_ENV_PROXY = '0'
  const file = fileURLToPath(new URL('./main.ts', import.meta.url))
  const child = spawn(process.execPath, [file], { env, stdio: ['ignore', 'pipe', 'pipe'] })
  const exited = once(child, 'exit')
  let buffer = ''
  let errors = ''
  child.stderr.on('data', chunk => { errors += chunk.toString() })
  const address = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => { child.kill('SIGKILL'); reject(new Error('等待服务就绪超时')) }, 15000)
    child.once('exit', code => { clearTimeout(timer); reject(new Error(`服务提前退出：${code} ${errors}`)) })
    child.stdout.on('data', chunk => {
      buffer += chunk.toString()
      let end
      while ((end = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, end)
        buffer = buffer.slice(end + 1)
        try {
          const event = JSON.parse(line)
          if (event.event === 'service.ready') { clearTimeout(timer); resolve(event.address) }
        } catch {}
      }
    })
  })
  return { child, exited, address }
}

// 通过已认证 HTTP 请求检查实际工作流与保存状态。
async function api (service, token, path, body) {
  const response = await fetch(service.address + path, {
    method: body === undefined ? 'GET' : 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    ...(body === undefined ? {} : { body: JSON.stringify(body) })
  })
  const data = await response.json()
  assert.equal(response.status, 200)
  return data
}

// 同一次验证覆盖启动配置、认证、在途排空、观测落库与进程重启。
const directory = await mkdtemp(join(tmpdir(), 'mastra20-'))
// 只使用一次性的本地凭证，不打印或写入项目。
const token = randomBytes(32).toString('base64url')
// 记录当前子进程，出现验证错误时仍进行回收。
let service
try {
  assert.throws(() => readConfig({}), /启动配置不完整/)
  service = await launch(directory, token, 'release-a')
  const live = await fetch(service.address + '/health/live')
  const ready = await fetch(service.address + '/health/ready')
  assert.equal(live.status, 200)
  assert.equal((await ready.json()).ready, true)
  const rejected = await fetch(service.address + '/api/workflows')
  assert.equal(rejected.status, 401)
  await rejected.arrayBuffer()
  const run = await api(service, token, '/api/workflows/notice-check/create-run', {})
  const result = await api(service, token, `/api/workflows/notice-check/start-async?runId=${run.runId}`, { inputData: { venue: null } })
  assert.equal(result.status, 'success')
  assert.equal(result.result.status, '待确认')
  const longRun = await api(service, token, '/api/workflows/notice-check/create-run', {})
  const pending = api(service, token, `/api/workflows/notice-check/start-async?runId=${longRun.runId}`, { inputData: { venue: '南门', waitMs: 600 } })
  let running = false
  for (let attempt = 0; attempt < 40; attempt++) {
    const state = await api(service, token, `/api/workflows/notice-check/runs/${longRun.runId}`)
    if (state.status === 'running') { running = true; break }
    await new Promise(resolve => setTimeout(resolve, 10))
  }
  assert(running, '停止前必须确认请求已进入运行状态')
  service.child.kill('SIGTERM')
  assert.equal((await pending).result.venue, '南门')
  assert.deepEqual(await service.exited, [0, null])
  service = await launch(directory, token, 'release-b')
  const saved = await api(service, token, `/api/workflows/notice-check/runs/${run.runId}`)
  assert.equal(saved.status, 'success')
  const traces = await api(service, token, '/api/observability/traces')
  assert(traces.spans?.length > 0 || traces.traces?.length > 0)
  service.child.kill('SIGTERM')
  assert.deepEqual(await service.exited, [0, null])
  service = undefined
  console.log('验证通过：配置校验、健康响应、认证拒绝、业务状态、在途排空、记录持久化与观测读回。')
} finally {
  if (service && service.child.exitCode === null) { service.child.kill('SIGTERM'); await service.exited }
  await rm(directory, { recursive: true, force: true })
}
