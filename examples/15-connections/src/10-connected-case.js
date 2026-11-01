import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import { MCPClient } from '@mastra/mcp'
import { z } from 'zod'
import { makeService } from './service.js'
import { startLocalHttp } from './local-http.js'

// 串起请求归属、工具查询、资料读取和具体草稿确认，所有结果均来自本机教学服务。
async function main () {
  const reader = z.enum(['甲', '乙', '无效']).parse(process.argv[2] || '甲')
  const activityId = z.enum(['reading', 'unknown', 'FAIL']).parse(process.argv[3] || 'reading')
  const services = new Map([['demo-reader-a', makeService('读者甲')], ['demo-reader-b', makeService('读者乙')]])
  const host = await startLocalHttp(req => {
    const token = req.headers.authorization?.match(/^Bearer ([A-Za-z0-9-]+)$/)?.[1]
    return services.get(token)
  }, [...services.values()])
  const token = { 甲: 'demo-reader-a', 乙: 'demo-reader-b', 无效: 'demo-invalid' }[reader]
  const client = new MCPClient({
    id: `connected-case-${randomUUID()}`,
    servers: { activity: { url: host.url, requestInit: { headers: { Authorization: `Bearer ${token}` } } } }
  })
  try {
    const { tools, errors, errorDetails } = await client.listToolsWithErrors({ perServerTimeoutMs: 3000 })
    if (Object.keys(errors).length) {
      console.log('工具发现失败，HTTP 状态：', errorDetails.activity?.httpStatus)
      throw new Error('未取得本请求的工具，停止查询与保存。')
    }
    const notice = z.object({
      status: z.enum(['已确认', '未查到', '查询失败']),
      venue: z.string().nullable(), source: z.string(), owner: z.string()
    }).parse(await tools.activity_lookupNotice.execute({ activityId }))
    console.log('实际查询证据：')
    console.dir(notice)
    assert.equal(notice.owner, `读者${reader}`)
    if (notice.status !== '已确认') {
      assert.equal(notice.venue, null)
      console.log('没有可确认的通知，本次不生成或保存地点草稿。')
      console.log('服务草稿数量：', await tools.activity_draftStatus.execute({}))
      return
    }
    const resource = await client.resources.read('activity', 'activity://reading/notice')
    const prompt = await client.prompts.get({ serverName: 'activity', name: 'review-notice', args: { material: '个人预约结果未提供。' } })
    console.dir({ 已读取正文: resource, 模板消息: prompt }, { depth: 5 })
    const draft = `阅读分享会：从${notice.venue}入场（${notice.owner}范围）。来源：${notice.source}。出发前核对个人预约状态；本次只保存草稿，不发送通知。`
    console.log('待保存的完整草稿：\n', draft)
    const before = await tools.activity_draftStatus.execute({})
    assert.equal(before.count, 0)
    const terminal = createInterface({ input: stdin, output: stdout })
    let decision
    try {
      decision = await terminal.question('输入“确认”将此草稿保存到服务内存，其他输入拒绝：')
    } finally {
      terminal.close()
    }
    if (decision.trim() === '确认') {
      console.log('保存工具结果：', await tools.activity_saveDraft.execute({ text: draft }))
    }
    const after = await tools.activity_draftStatus.execute({})
    assert.equal(after.count, decision.trim() === '确认' ? 1 : 0)
    console.log('服务草稿数量：', after)
    console.log('本次核对完成；服务退出后内存草稿会清空。')
  } finally {
    try {
      await client.disconnect()
    } finally {
      await host.close()
    }
  }
}

// 让认证、协议和保存失败保留非零退出状态，便于区分未完成的任务。
main().catch(error => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
