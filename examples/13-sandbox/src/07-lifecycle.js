import { LocalSandbox, Workspace } from '@mastra/core/workspace'
import { RequestContext } from '@mastra/core/request-context'
import { resolve } from 'node:path'
import { writeFile, readFile } from 'node:fs/promises'
import { z } from 'zod'

// 应用记录自己创建的运行环境，负责在任务结束时回收。
const owned = new Map()
// 相同归属跨请求复用环境，不同归属分别创建。
const workspace = new Workspace({
  sandbox: async ({ requestContext }) => {
    const reader = z.enum(['reader-a', 'reader-b']).parse(requestContext.get('reader'))
    const sandbox = new LocalSandbox({ workingDirectory: resolve('lab/07-lifecycle', reader) })
    await sandbox.start()
    owned.set(reader, sandbox)
    return sandbox
  },
  sandboxCacheKey: ({ requestContext }) => z.enum(['reader-a', 'reader-b']).parse(requestContext.get('reader'))
})
// 每次建立新的请求上下文，归属由应用给出。
function contextFor (reader) {
  const context = new RequestContext()
  context.set('reader', reader)
  return context
}
try {
  const first = await workspace.resolveSandbox({ requestContext: contextFor('reader-a') })
  const same = await workspace.resolveSandbox({ requestContext: contextFor('reader-a') })
  const other = await workspace.resolveSandbox({ requestContext: contextFor('reader-b') })
  console.dir({ sameReaderReuses: first === same, differentReaderSeparates: first !== other, created: owned.size })
  await writeFile(resolve(first.workingDirectory, 'output.txt'), '第一位教学用户的本地产物。')
} finally {
  for (const [reader, sandbox] of owned) {
    await sandbox.destroy()
    workspace.clearSandboxCache(reader)
  }
  await workspace.destroy()
}
console.log('本地产物仍在：', await readFile(resolve('lab/07-lifecycle/reader-a/output.txt'), 'utf8'))
