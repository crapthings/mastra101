import { Memory } from '@mastra/memory'
import { LibSQLStore } from '@mastra/libsql'

// 文件数据库用于观察退出进程后的数据保留。
const memory = new Memory({
  storage: new LibSQLStore({ id: 'storage-intro', url: 'file:./01-storage.db' }),
  options: { semanticRecall: false, generateTitle: false }
})

// 固定教学标识，写入与读取两个进程指向同一段会话。
const threadId = 'demo-activity-storage'
// 应用确认的教学归属保持一致。
const resourceId = 'demo-reader'
// 每次只执行写入或读取中的一个动作。
const mode = process.argv[2] || '读取'
if (!['写入', '读取'].includes(mode)) throw new Error('请使用“写入”或“读取”。')
if (mode === '写入') {
  await memory.createThread({ threadId, resourceId, title: '阅读分享会：存储教学记录' })
}

// 回查数据库，不通过模型复述判断写入成功。
const thread = await memory.getThreadById({ threadId })
if (thread && thread.resourceId !== resourceId) throw new Error('会话归属不一致。')
console.dir(thread, { depth: null })
if (!thread) console.log('没有这条教学记录，请在同一目录先执行写入。')
