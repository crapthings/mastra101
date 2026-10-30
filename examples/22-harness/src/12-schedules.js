import { Mastra } from '@mastra/core'
import { createAssistant, createStorage } from './assistant.js'

// 等待本次手动触发的实际执行结束，而不是把入队当成完成。
const completion = Promise.withResolvers()
// 限制等待演示结果的时间。
const timeout = setTimeout(() => completion.reject(new Error('未在 60 秒内收到执行结果')), 60_000)
// 用完成钩子核对无会话定时任务的运行结果。
const storage = await createStorage('schedules')
// 配置本入口使用的核查助手。
const reviewer = createAssistant(storage)
// 注册助手及其共用的运行服务。
const mastra = new Mastra({
  agents: { reviewer },
  storage,
  schedules: {
    onFinish: ({ outcome, runId }) => completion.resolve({ outcome, runId }),
    onError: ({ error }) => completion.reject(error),
    onAbort: () => completion.reject(new Error('定时任务被取消'))
  }
})
// 保留新建计划的标识，退出前清理演示计划。
let scheduleId

try {
  await mastra.startWorkers()
  const schedule = await mastra.schedules.create({
    agentId: 'policy-reviewer',
    cron: '0 9 * * 1-5',
    timezone: 'Asia/Shanghai',
    prompt: '材料：今天新增一条制度，超额住宿需要事先书面批准。请列出应提醒申请人的事项。'
  })
  scheduleId = schedule.id
  await mastra.schedules.pause(scheduleId)
  console.log('已暂停周期触发：', (await mastra.schedules.get(scheduleId)).status)
  console.log('手动触发凭据：', await mastra.schedules.run(scheduleId))
  console.log('本次执行结束：', await completion.promise)
} finally {
  clearTimeout(timeout)
  if (scheduleId) await mastra.schedules.delete(scheduleId)
  await mastra.shutdown()
  await storage.close()
}
