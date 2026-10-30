import { Agent } from '@mastra/core/agent'
import { Memory } from '@mastra/memory'
import { LibSQLStore } from '@mastra/libsql'

// 两次进程使用相同数据库位置，才能继续读取同一份历史。
const memory = new Memory({
  storage: new LibSQLStore({ id: 'persistent-storage', url: 'file:./08-persistence.db' }),
  options: { lastMessages: 8, semanticRecall: false, generateTitle: false }
})

// 由应用提供固定教学标识，实际项目应来自已核实的用户与会话。
const identity = { resource: 'demo-reader', thread: 'demo-weekend-activity' }

// 写入和读取分两次运行脚本，模拟进程退出后继续对话。
const mode = process.argv[2] || '读取'
if (!['写入', '读取'].includes(mode)) throw new Error('请使用“写入”或“读取”。')

// 使用相同记忆配置重新创建 Agent，不依赖上一个进程的对象。
const agent = new Agent({
  id: 'persistent-activity', name: '活动资料助手', model: 'vercel/openai/gpt-6.1-sol', memory,
  instructions: '用中文依据可见活动资料回答。没有资料时说明需要补充，不猜入场地点。'
})

// 读取前先检查存储，避免把模型猜中当成持久化成功。
const thread = await memory.getThreadById({ threadId: identity.thread })
if (mode === '读取' && !thread) throw new Error('没有教学历史，请先运行“写入”。')
if (thread && thread.resourceId !== identity.resource) throw new Error('会话归属不一致。')

// 写入后退出，再运行读取命令核对已有消息。
const result = await agent.generate(mode === '写入' ? '教学资料：阅读分享会从东门入场，请记下。' : '上次说阅读分享会从哪个入口进场？', {
  memory: identity, maxSteps: 1, abortSignal: AbortSignal.timeout(60_000)
})
console.log(result.text)
