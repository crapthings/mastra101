import { Mastra } from '@mastra/core'
import { Agent } from '@mastra/core/agent'
import { Memory } from '@mastra/memory'
import { LibSQLStore } from '@mastra/libsql'
import { randomUUID } from 'node:crypto'

// 为同一实例上的运行数据提供默认存储。
const shared = new LibSQLStore({ id: 'shared-storage', url: 'file:./02-shared.db' })
// 一个助手的记忆改用独立数据库，其他配置不受这个覆盖影响。
const privateStore = new LibSQLStore({ id: 'private-memory-storage', url: 'file:./02-private.db' })
// 这个助手的记忆从 Mastra 实例取得存储。
const sharedAgent = new Agent({
  id: 'shared-activity', name: '共享存储助手', model: 'vercel/openai/gpt-6.1-sol',
  instructions: '用中文核对活动资料。',
  memory: new Memory({ options: { semanticRecall: false, generateTitle: false } })
})
// 这个助手通过 Memory 配置独立的存储，不发起模型调用。
const privateAgent = new Agent({
  id: 'private-activity', name: '独立记忆存储助手', model: 'vercel/openai/gpt-6.1-sol',
  instructions: '用中文核对活动资料。',
  memory: new Memory({ storage: privateStore, options: { semanticRecall: false, generateTitle: false } })
})
// 注册后通过实例取得助手，使共享配置参与初始化。
const mastra = new Mastra({ storage: shared, agents: { sharedAgent, privateAgent } })
// 从注册后的助手取得记忆，不根据文件名猜配置是否生效。
const firstMemory = await mastra.getAgentById('shared-activity').getMemory()
// 第二份记忆应使用显式配置的独立存储。
const secondMemory = await mastra.getAgentById('private-activity').getMemory()
if (!firstMemory || !secondMemory) throw new Error('助手没有配置记忆。')

// 使用唯一教学会话标识，便于对照两个后端的实际记录。
const sharedThread = randomUUID()
// 独立记忆会话拥有不同标识。
const privateThread = randomUUID()
await firstMemory.createThread({ threadId: sharedThread, resourceId: 'demo-reader', title: '共享后端中的会话' })
await secondMemory.createThread({ threadId: privateThread, resourceId: 'demo-reader', title: '独立后端中的会话' })

// 检查两个数据库的 memory 领域，核对配置覆盖的落点。
const sharedDomain = await shared.getStore('memory')
// 直接访问独立后端，验证记录确实写到这里。
const privateDomain = await privateStore.getStore('memory')
console.dir({
  sharedHasShared: Boolean(await sharedDomain.getThreadById({ threadId: sharedThread })),
  sharedHasPrivate: Boolean(await sharedDomain.getThreadById({ threadId: privateThread })),
  privateHasPrivate: Boolean(await privateDomain.getThreadById({ threadId: privateThread }))
})
