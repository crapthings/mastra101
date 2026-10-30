import assert from 'node:assert/strict'
import { createThreadRuntime } from './thread-runtime.js'

// 本例只保存收件箱，不立即投递，也不启动模型。
const runtime = await createThreadRuntime('notifications', {
  notifications: { deliveryPolicy: { default: 'persist' } }
})
try {
  const event = {
    source: 'policy-service', kind: 'policy-updated', priority: 'high',
    summary: '差旅制度更新：超额住宿仍需事先书面批准。',
    payload: { docId: 'travel-2026', version: 2 }, dedupeKey: 'travel-2026:v2'
  }
  const first = await runtime.reviewer.sendNotificationSignal(event, runtime.thread)
  const repeated = await runtime.reviewer.sendNotificationSignal(event, runtime.thread)
  const inbox = await runtime.storage.getStore('notifications')
  const records = await inbox.listNotifications(runtime.thread)
  assert.equal(first.record.id, repeated.record.id)
  assert.equal(records.length, 1)
  console.log('投递策略：', first.decision.action)
  console.log('待处理通知：', records.map(record => ({ id: record.id, status: record.status, summary: record.summary, payload: record.payload })))
} finally {
  await runtime.close()
}
