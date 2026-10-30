import { LibSQLStore } from '@mastra/libsql'
import { randomUUID } from 'node:crypto'

// 一个存储适配器提供多个数据领域，初始化由脚本显式完成。
const storage = new LibSQLStore({ id: 'domain-storage', url: 'file:./03-domains.db' })
await storage.init()

// 按领域取得接口，不把所有运行数据当成同一种记录。
const memoryDomain = await storage.getStore('memory')
// 工作流领域用于保存工作流运行状态，本例只检查接口是否提供。
const workflowDomain = await storage.getStore('workflows')
// 评分领域保存评估结果，本例尚未配置评分器。
const scoreDomain = await storage.getStore('scores')
console.dir({ memory: Boolean(memoryDomain), workflows: Boolean(workflowDomain), scores: Boolean(scoreDomain) })

// 直接使用 memory 领域保存一条教学会话，区别于上层 Memory 的便捷接口。
const thread = {
  id: randomUUID(), resourceId: 'demo-reader', title: '按领域保存的活动会话',
  createdAt: new Date(), updatedAt: new Date(), metadata: {}
}
await memoryDomain.saveThread({ thread })
console.dir(await memoryDomain.getThreadById({ threadId: thread.id }), { depth: null })
