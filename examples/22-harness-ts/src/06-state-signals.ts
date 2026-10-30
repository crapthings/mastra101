import { createThreadRuntime, receiveTurn } from './thread-runtime.ts'

// 将核查状态放进命名状态位，结构数据与模型可读说明分别提供。
const runtime = await createThreadRuntime('state-signals')
try {
  const state = {
    id: 'application', mode: 'snapshot', cacheKey: 'application:001:v1',
    contents: '申请 001：住宿金额 560 元，制度上限 500 元，尚无事先书面批准记录。',
    value: { amount: 560, limit: 500, approval: null }
  }
  const first = await runtime.reviewer.sendStateSignal(state, { ...runtime.thread, ifIdle: { behavior: 'persist' } })
  if (!first.skipped) {
    await first.accepted
    await first.persisted
  }
  const duplicate = await runtime.reviewer.sendStateSignal(state, { ...runtime.thread, ifIdle: { behavior: 'persist' } })
  console.log('相同版本是否跳过：', duplicate)
  const subscription = await runtime.reviewer.subscribeToThread({ ...runtime.thread, withRunStatus: true })
  try {
    console.log('当前状态的核查结果：', await receiveTurn(subscription, () => runtime.reviewer.sendMessage('根据当前申请状态，说明为什么还不能直接确认可报销。', runtime.thread)))
  } finally {
    subscription.unsubscribe()
  }
} finally {
  await runtime.close()
}
