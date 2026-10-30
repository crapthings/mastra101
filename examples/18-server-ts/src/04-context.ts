import { MastraClient } from '@mastra/client-js'
import { createLab } from './lab.ts'

// 即使调用方提交 requestId，服务端中间件也为每次请求重新生成标识。
const lab = await createLab()
try {
  const client = new MastraClient({ baseUrl: lab.baseUrl, retries: 0 })
  const workflow = client.getWorkflow('notice-check')
  for (const venue of ['南门', null]) {
    const run = await workflow.createRun()
    const result = await run.startAsync({ inputData: { venue }, requestContext: { requestId: '调用方提交的标识' } })
    console.log('运行标识：', run.runId, '工作流状态：', result.status, '交付结果：', result.result)
  }
} finally {
  await lab.close()
}
