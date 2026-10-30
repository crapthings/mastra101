import { Mastra } from '@mastra/core/mastra'
import { MastraCompositeStore } from '@mastra/core/storage'
import { RequestContext } from '@mastra/core/request-context'
import { LibSQLStore } from '@mastra/libsql'
import { DuckDBStore } from '@mastra/duckdb'
import { Observability, MastraStorageExporter } from '@mastra/observability'
import { createActivityWorkflow } from './workflow.ts'

// 每次实验使用独立的内存数据库，避免上一次的数据混入统计。
export async function createLab () {
  const analytics = new DuckDBStore({ id: 'activity-analytics', path: ':memory:' })
  const observabilityStore = await analytics.getStore('observability')
  const mastra = new Mastra({
    workflows: { activityCheck: createActivityWorkflow() },
    storage: new MastraCompositeStore({
      id: 'activity-storage',
      default: new LibSQLStore({ id: 'activity-state', url: ':memory:' }),
      domains: { observability: observabilityStore }
    }),
    observability: new Observability({ configs: { default: {
      serviceName: 'activity-assistant',
      requestContextKeys: ['requestId'],
      logging: { enabled: true, level: 'info' },
      exporters: [new MastraStorageExporter()]
    } } })
  })
  return { mastra, store: observabilityStore }
}

// 运行一次确定性的活动核对，并在查询前等待观测数据导出。
export async function runActivity (lab, { mode = 'ok', delayMs = 5, requestId = 'request-demo', tracingOptions = {} } = {}) {
  const requestContext = new RequestContext()
  requestContext.set('requestId', requestId)
  const run = await lab.mastra.getWorkflow('activityCheck').createRun()
  const result = await run.start({
    inputData: { venue: '南门', delayMs, mode },
    requestContext,
    tracingOptions
  })
  await lab.mastra.observability.flush()
  return { result, runId: run.runId }
}
