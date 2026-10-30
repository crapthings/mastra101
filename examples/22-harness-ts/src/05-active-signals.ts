import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import { createThreadRuntime, receiveTurn } from './thread-runtime.ts'

// 等工具确实开始后，再模拟外部系统补充材料。
const entered = Promise.withResolvers()
// 由主程序放行只读工具，避免用猜测的延时判断运行是否活动。
const release = Promise.withResolvers()
// 单独统计工具实际执行次数，核对补充信号没有重复执行查询。
let executions = 0
// 工具等待期间仍属于同一次运行，返回值来自教学数据。
const readPolicy = createTool({
  id: 'read-policy', description: '读取当前差旅制度，等待应用确认数据就绪。', inputSchema: z.object({}),
  execute: async () => {
    executions++
    entered.resolve()
    await release.promise
    return { limit: 500, approvalRequired: true }
  }
})
// 首次模型步骤固定为只读查询，后续只整理已有材料。
const runtime = await createThreadRuntime('active-signals', {
  tools: { readPolicy },
  defaultOptions: { maxSteps: 4, prepareStep: ({ stepNumber }) => ({ toolChoice: stepNumber === 0 && executions === 0 ? { type: 'tool', toolName: 'readPolicy' } : 'none' }) }
})
// 两次运行使用同一订阅，消息按运行标识分别显示。
const subscription = await runtime.reviewer.subscribeToThread({ ...runtime.thread, withRunStatus: true })
// 限制等工具开始的时间，同时准备释放工具，避免异常退出留下等待。
const timer = setTimeout(() => entered.reject(new Error('工具尚未开始，无法验证活动信号')), 60_000)
// 接上读取任务的失败处理，后续统一等待或收尾。
const first = receiveTurn(subscription, () => runtime.reviewer.sendMessage('先调用 readPolicy，再核查 560 元住宿申请。', runtime.thread))
first.catch(() => {})
try {
  await entered.promise
  const update = runtime.reviewer.sendSignal({ type: 'reactive', tagName: 'approval-update', contents: '应用补充：这份申请还没有事先书面批准记录。' }, runtime.thread)
  console.log('活动运行的投递决定：', (await update.accepted).action)
  const followUp = runtime.reviewer.queueMessage('上一轮结束后，请单独列出仍需用户提供的材料。', runtime.thread)
  followUp.accepted.catch(() => {})
  release.resolve()
  console.log('原运行：', await first)
  console.log('排队后的运行：', await receiveTurn(subscription, () => followUp))
  console.log('只读工具执行次数：', executions)
} finally {
  clearTimeout(timer)
  release.resolve()
  subscription.unsubscribe()
  await first.catch(() => {})
  await runtime.close()
}
