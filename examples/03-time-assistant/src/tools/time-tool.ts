import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import { readTime } from './read-time.ts'

// 将时间函数包装为模型可请求的工具，并明确成功与失败的返回结构。
export const getCurrentTime = createTool({
  id: 'get-current-time',
  description: '读取指定时区的当前时间，返回取样时刻。适合回答“现在几点”。',
  inputSchema: z.object({
    timeZone: z.string().min(1).describe('时区标识，例如 Asia/Tokyo 或 Asia/Shanghai')
  }),
  outputSchema: z.discriminatedUnion('ok', [
    z.object({
      ok: z.literal(true),
      timeZone: z.string(),
      capturedAt: z.string(),
      localTime: z.string()
    }),
    z.object({
      ok: z.literal(false),
      timeZone: z.string(),
      error: z.string()
    })
  ]),
  execute: async ({ timeZone }) => readTime(timeZone)
})
