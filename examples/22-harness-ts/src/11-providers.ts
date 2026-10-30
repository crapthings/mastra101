import assert from 'node:assert/strict'
import { PolicyEvents } from './policy-events.ts'
import { createThreadRuntime } from './thread-runtime.ts'

// 事件提供方保存来源订阅，通知策略仍只写入收件箱。
const events = new PolicyEvents()
// 只让当前线程订阅差旅制度，不订阅其他文件。
const runtime = await createThreadRuntime('providers', {
  signals: [events], notifications: { deliveryPolicy: { default: 'persist' } }
})
try {
  events.watch(runtime.thread, 'travel-2026')
  console.log('匹配事件：', await events.handleWebhook({ body: { documentId: 'travel-2026', version: 2 } }))
  console.log('不匹配事件：', await events.handleWebhook({ body: { documentId: 'other-policy', version: 2 } }))
  const inbox = await runtime.storage.getStore('notifications')
  const records = await inbox.listNotifications(runtime.thread)
  assert.equal(records.length, 1)
  console.log('当前线程收到的通知：', records.map(record => record.summary))
} finally {
  events.stop()
  await runtime.close()
}
