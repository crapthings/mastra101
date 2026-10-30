import { Workspace, LocalFilesystem } from '@mastra/core/workspace'
import { resolve } from 'node:path'
import { RequestContext } from '@mastra/core/request-context'
import { z } from 'zod'

// 教学归属来自应用已确认的有限集合，不直接把任意用户输入拼成路径。
const readerSchema = z.enum(['reader-a', 'reader-b'])
// 每个请求解析到对应用户的文件系统。
const workspace = new Workspace({
  filesystem: ({ requestContext }) => new LocalFilesystem({ basePath: resolve('lab/06-users', readerSchema.parse(requestContext.get('reader'))) })
})
for (const reader of ['reader-a', 'reader-b']) {
  const requestContext = new RequestContext()
  requestContext.set('reader', reader)
  const filesystem = await workspace.resolveFilesystem({ requestContext })
  await filesystem.init()
  await filesystem.writeFile('preference.txt', `${reader} 的教学资料，仅属于这位用户。`)
  console.log(reader, await filesystem.readFile('preference.txt', { encoding: 'utf8' }))
}
await workspace.destroy()
