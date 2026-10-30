import { createThreadRuntime, receiveTurn } from './thread-runtime.js'

// 一个线程订阅接收两次运行，各次输出仍按 runId 区分。
const runtime = await createThreadRuntime('thread-streams')
// 先订阅再发消息，避免错过最初的实时事件。
const subscription = await runtime.reviewer.subscribeToThread({
  ...runtime.thread, withInitialHistory: true, withRunStatus: true
})
try {
  const first = await receiveTurn(subscription, () => runtime.reviewer.sendMessage('制度：住宿每晚不超过 500 元，超出须事先书面批准。先列出核查条件。', runtime.thread))
  console.log('第一次运行：', first)
  const second = await receiveTurn(subscription, () => runtime.reviewer.sendMessage('申请金额是 560 元，还没有批准记录。现在还缺什么？', runtime.thread))
  console.log('第二次运行：', second)
  console.log('是否为不同运行：', first.runId !== second.runId)
} finally {
  subscription.unsubscribe()
  await runtime.close()
}
