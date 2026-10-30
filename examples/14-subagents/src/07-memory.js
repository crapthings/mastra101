import { Memory } from '@mastra/memory'
import { LibSQLStore } from '@mastra/libsql'
import { randomUUID } from 'node:crypto'
import { activity, makeReviewer, makeCoordinator } from './shared.js'

// 父子共用存储接口，但分别保存到各自的会话。
const memory = new Memory({
  storage: new LibSQLStore({ id: 'delegation-memory', url: 'file:./07-memory.db' }),
  options: { lastMessages: 8, semanticRecall: false, generateTitle: false, workingMemory: { enabled: false } }
})
// 每次启动使用独立教学归属，便于识别本轮记录。
const resource = `reader-${randomUUID()}`
// 两次父调用继续使用同一段主会话。
const thread = `parent-${randomUUID()}`
// 应用保留两次委派返回的子会话标识。
const childThreads = []
// 子任务有自己的记忆配置，以便直接回查已保存内容。
const reviewer = makeReviewer({ memory })
// 主任务保留连续对话，子任务由框架为每次委派建立新会话。
const parent = makeCoordinator({ reviewer }, { memory })
for (const question of [`核对这份通知：${activity}`, '再核对一次原通知，仍需保留个人预约缺口。']) {
  const result = await parent.generate(question, {
    memory: { resource, thread }, maxSteps: 3, abortSignal: AbortSignal.timeout(60000),
    delegation: {
      onDelegationComplete: ({ result }) => {
        if (result?.subAgentThreadId) childThreads.push(result.subAgentThreadId)
      }
    }
  })
  console.log(result.text)
}
console.dir({ 主会话: thread, 子会话: childThreads, 子会话各自独立: childThreads.length === 2 && new Set(childThreads).size === 2 })
for (const threadId of childThreads) {
  const saved = await memory.recall({ threadId, perPage: false })
  console.dir({ threadId, 保存的消息: saved.messages }, { depth: 5 })
}
