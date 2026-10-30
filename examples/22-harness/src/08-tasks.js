import { TaskSignalProvider } from '@mastra/core/signals'
import { createThreadRuntime } from './thread-runtime.js'

// 任务工具和状态处理器一起注册，任务清单保存在当前线程。
const tasks = new TaskSignalProvider()
// 只完成材料核对，不把等待批准的事项自动标成完成。
const runtime = await createThreadRuntime('tasks', {
  signals: [tasks],
  instructions: '用 task_write 建立两项任务：核对住宿材料、取得事先书面批准。只将第一项标为完成，第二项保留 pending；最后调用 task_check，不要虚构批准。'
})
try {
  const result = await runtime.reviewer.generate('材料：申请 560 元，上限 500 元，尚无批准记录。维护核查任务清单。', {
    memory: { thread: runtime.thread.threadId, resource: runtime.thread.resourceId },
    maxSteps: 5,
    onStepFinish: ({ toolCalls, toolResults }) => console.dir({ toolCalls, toolResults }, { depth: 6 })
  })
  console.log('核查说明：', result.text)
} finally {
  tasks.stop()
  await runtime.close()
}
