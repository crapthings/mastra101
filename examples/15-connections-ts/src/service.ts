import { MCPServer } from '@mastra/mcp'
import { createTool } from '@mastra/core/tools'
import { z } from 'zod'

// 创建一份本地教学服务，公开查询、资源、提示模板和草稿操作。
export function makeService (owner = '公开通知') {
  const drafts = []
  const lookupNotice = createTool({
    id: 'lookup-notice', description: '查询教学活动通知，reading 为已知编号，FAIL 模拟查询失败。',
    inputSchema: z.object({ activityId: z.string().min(1) }),
    outputSchema: z.object({ status: z.enum(['已确认', '未查到', '查询失败']), venue: z.string().nullable(), source: z.string(), owner: z.string() }),
    execute: async ({ activityId }) => ({
      status: activityId === 'reading' ? '已确认' : activityId === 'FAIL' ? '查询失败' : '未查到',
      venue: activityId === 'reading' ? owner === '读者乙' ? '东门' : '南门' : null,
      source: '本地教学通知 v1', owner
    })
  })
  const saveDraft = createTool({
    id: 'save-draft', description: '在本服务进程内保存教学提醒草稿，不发送通知。',
    inputSchema: z.object({ text: z.string().min(1).max(200) }),
    outputSchema: z.object({ status: z.literal('草稿已保存'), count: z.number() }),
    execute: async ({ text }) => {
      drafts.push(text)
      return { status: '草稿已保存', count: drafts.length }
    }
  })
  const draftStatus = createTool({
    id: 'draft-status', description: '读取本服务已保存的教学草稿数量。',
    inputSchema: z.object({}), outputSchema: z.object({ count: z.number() }),
    execute: async () => ({ count: drafts.length })
  })
  const server = new MCPServer({
    id: 'activity-service', name: '活动通知教学服务', version: '1.0.0',
    tools: { lookupNotice, saveDraft, draftStatus },
    resources: {
      listResources: async () => [{ uri: 'activity://reading/notice', name: '阅读分享会通知', mimeType: 'text/plain' }],
      getResourceContent: async ({ uri }) => {
        if (uri !== 'activity://reading/notice') throw new Error('未找到教学资源')
        return { text: '阅读分享会周六下午两点开始，一点半开放入场，需要预约。未提供个人预约记录。' }
      }
    },
    prompts: {
      listPrompts: async () => [{ name: 'review-notice', description: '核对一份通知中的事实与缺口。', arguments: [{ name: 'material', description: '待核对的活动材料', required: true }] }],
      getPromptMessages: async ({ name, args }) => {
        if (name !== 'review-notice') throw new Error('未找到教学提示模板')
        return [{ role: 'user', content: { type: 'text', text: `请区分已确认信息和待确认事项，不补写个人预约状态。材料：${args.material}` } }]
      }
    }
  })
  return server
}
