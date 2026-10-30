import { createThreadRuntime, receiveTurn } from './thread-runtime.js'

// 先保存工具取得的补充材料，不因更新本身启动模型。
const runtime = await createThreadRuntime('signals')
try {
  const signal = runtime.reviewer.sendSignal({
    type: 'reactive', tagName: 'approval-update',
    contents: '教学系统更新：560 元住宿申请仍缺少事先书面批准记录。'
  }, { ...runtime.thread, ifIdle: { behavior: 'persist' } })
  const accepted = await signal.accepted
  console.log('仅保存的投递决定：', accepted.action)
  if (accepted.action !== 'persist') throw new Error('没有进入预期的仅保存分支')
  await signal.persisted
  const subscription = await runtime.reviewer.subscribeToThread({ ...runtime.thread, withRunStatus: true })
  try {
    console.log('显式提问后的结果：', await receiveTurn(subscription, () => runtime.reviewer.sendMessage('根据刚才保存的材料，列出仍需补充的资料。', runtime.thread)))
  } finally {
    subscription.unsubscribe()
  }
} finally {
  await runtime.close()
}
