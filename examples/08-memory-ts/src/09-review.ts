import { Memory } from '@mastra/memory'
import { LibSQLStore } from '@mastra/libsql'
import { randomUUID } from 'node:crypto'

// 用本地记忆 API 核对修改与删除的范围，不调用模型。
const memory = new Memory({
  storage: new LibSQLStore({ id: 'review-storage', url: 'file:./09-review.db' }),
  options: { semanticRecall: false, workingMemory: { enabled: true, scope: 'resource', template: '# 活动偏好\n- 提醒风格：' } }
})

// 每次运行使用新资源，避免改动其他教学记录。
const resourceId = randomUUID()
// 创建一段归属于该教学用户的会话。
const thread = await memory.createThread({ threadId: randomUUID(), resourceId, title: '偏好核对' })
await memory.saveMessages({ messages: [{
  id: randomUUID(), threadId: thread.id, resourceId, role: 'user', createdAt: new Date(),
  content: { format: 2, parts: [{ type: 'text', text: '活动提醒请详细一点。' }] }
}] })
await memory.updateWorkingMemory({ threadId: thread.id, resourceId, workingMemory: '# 活动偏好\n- 提醒风格：详细' })
// 应用已取得用户的新确认，用明确内容修正工作记忆。
await memory.updateWorkingMemory({ threadId: thread.id, resourceId, workingMemory: '# 活动偏好\n- 提醒风格：简短' })
console.log('当前偏好：', await memory.getWorkingMemory({ threadId: thread.id, resourceId }))
console.log('旧消息仍保留：', (await memory.recall({ threadId: thread.id, resourceId, perPage: false })).messages.length)

// 删除本次会话，核对资源范围的偏好并不会随之自动清除。
await memory.deleteThread(thread.id)
console.log('删除后的会话：', await memory.getThreadById({ threadId: thread.id }))
console.log('资源偏好仍需另行处理：', await memory.getWorkingMemory({ threadId: thread.id, resourceId }))
