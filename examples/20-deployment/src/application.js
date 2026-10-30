import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { setTimeout as delay } from 'node:timers/promises'
import { Mastra } from '@mastra/core/mastra'
import { Agent } from '@mastra/core/agent'
import { SimpleAuth } from '@mastra/core/server'
import { MastraCompositeStore } from '@mastra/core/storage'
import { createStep, createWorkflow } from '@mastra/core/workflows'
import { LibSQLStore } from '@mastra/libsql'
import { DuckDBStore } from '@mastra/duckdb'
import { Observability, MastraStorageExporter } from '@mastra/observability'
import { z } from 'zod'

// 用持久存储、认证和观测组成一个可启动的通知应用。
export async function createApplication (config) {
  await mkdir(config.dataDir, { recursive: true })
  const analytics = new DuckDBStore({ id: 'runtime-observability', path: join(config.dataDir, 'observability.duckdb') })
  const observability = await analytics.getStore('observability')
  const storage = new MastraCompositeStore({
    id: 'runtime-storage',
    default: new LibSQLStore({ id: 'runtime-state', url: pathToFileURL(join(config.dataDir, 'application.db')).href }),
    domains: { observability }
  })
  await storage.init()
  const inputSchema = z.object({ venue: z.string().min(1).nullable(), waitMs: z.number().int().min(0).max(1000).default(0) })
  const outputSchema = z.object({ status: z.string(), venue: z.string().nullable() })
  const prepare = createStep({
    id: 'prepare-notice', inputSchema, outputSchema,
    execute: async ({ inputData, abortSignal }) => {
      await delay(inputData.waitMs, undefined, { signal: abortSignal })
      return { status: inputData.venue === null ? '待确认' : '已确认', venue: inputData.venue }
    }
  })
  const workflow = createWorkflow({ id: 'notice-check', inputSchema, outputSchema }).then(prepare).commit()
  const agent = new Agent({ id: 'notice-helper', name: '通知助手', model: 'vercel/openai/gpt-6.1-sol', instructions: '根据给定通知整理提醒。入口未公布时明确待确认，不补写入口。' })
  return new Mastra({
    agents: { noticeHelper: agent }, workflows: { noticeCheck: workflow }, storage,
    observability: new Observability({ configs: { default: {
      serviceName: 'notice-runtime', exporters: [new MastraStorageExporter()],
      // 限制单个字符串的记录长度，敏感数据仍需按采集规则处理。
      serializationOptions: { maxStringLength: 500 }
    } } }),
    server: { auth: new SimpleAuth({
      tokens: { [config.token]: { id: 'service-caller', name: '内部调用方' } },
      protected: ['/api/*'], public: ['/health/*', '/api/auth/*'],
      mapUserToResourceId: user => user.id
    }) }
  })
}
