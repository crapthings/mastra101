import { MastraCompositeStore } from '@mastra/core/storage'
import { LibSQLStore, MemoryLibSQL } from '@mastra/libsql'
import { Memory } from '@mastra/memory'
import { randomUUID } from 'node:crypto'

// 未单独覆盖的领域使用默认后端。
const defaultStore = new LibSQLStore({ id: 'default-store', url: 'file:./06-default.db' })
// memory 领域单独连接另一教学数据库。
const memoryDomain = new MemoryLibSQL({ url: 'file:./06-memory.db' })
// 按领域选择后端，示例用两个本地文件代替不同服务。
const storage = new MastraCompositeStore({
  id: 'composite-storage', default: defaultStore, domains: { memory: memoryDomain }
})
// 上层记忆仍使用相同接口，后端由组合存储路由。
const memory = new Memory({ storage, options: { semanticRecall: false, generateTitle: false } })
// 唯一标识用于验证这条记录没有落入默认 memory 领域。
const threadId = randomUUID()
await memory.createThread({ threadId, resourceId: 'demo-reader', title: '路由后的活动会话' })

// 两个 memory 接口的读回结果，直接证明领域覆盖的落点。
const fallbackMemory = await defaultStore.getStore('memory')
console.dir({
  routedHasThread: Boolean(await memoryDomain.getThreadById({ threadId })),
  defaultHasThread: Boolean(await fallbackMemory.getThreadById({ threadId })),
  workflowUsesDefault: (await storage.getStore('workflows')) === (await defaultStore.getStore('workflows'))
})
