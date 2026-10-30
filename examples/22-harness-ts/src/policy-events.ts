import { SignalProvider } from '@mastra/core/signals'
import { z } from 'zod'

// 将已由应用接收的制度更新，映射到订阅这份制度的线程。
export class PolicyEvents extends SignalProvider {
  id = 'policy-events'

  watch (target, documentId) {
    return this.subscribe(target, documentId)
  }

  async handleWebhook ({ body }) {
    const event = z.object({ documentId: z.string().min(1), version: z.number().int().positive() }).parse(body)
    const subscriptions = this.getSubscriptionsForResource(event.documentId)
    for (const target of subscriptions) {
      await this.notify({
        source: this.id, kind: 'policy-updated', priority: 'high',
        summary: `制度 ${event.documentId} 已更新到第 ${event.version} 版，请重新核对引用。`,
        payload: event, dedupeKey: `${event.documentId}:${event.version}`
      }, { resourceId: target.resourceId, threadId: target.threadId })
    }
    return { status: 200, body: { matched: subscriptions.length } }
  }
}
