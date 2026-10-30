import { A2AAgent } from '@mastra/core/a2a'
import { startLocalA2A } from './local-a2a.js'

// 三种受控任务状态用来观察远程结果映射，不运行真实远程模型。
const mode = process.argv[2] || '完成'
if (!['完成', '等待', '失败'].includes(mode)) throw new Error('请使用“完成”“等待”或“失败”。')
// 先准备一个本地远端，再把能力卡地址交给客户端。
const remote = await startLocalA2A(mode)
try {
  const agent = new A2AAgent({ url: remote.cardUrl, retries: 0, timeoutMs: 3000 })
  const result = await agent.generate('核对这份活动安排。')
  console.dir({
    text: result.text,
    finishReason: result.finishReason,
    远程任务状态: result.task?.status.state,
    taskId: result.task?.id,
    suspendPayload: result.suspendPayload
  }, { depth: 5 })
  if (result.task?.status.state === 'failed') process.exitCode = 1
} catch (error) {
  console.error('远程任务没有正常交付：', error.message)
  process.exitCode = 1
} finally {
  await remote.close()
}
