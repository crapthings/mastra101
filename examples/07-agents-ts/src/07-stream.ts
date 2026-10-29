import { Agent } from '@mastra/core/agent'
import { createReservationTool } from './reservation.ts'

// 流式输出查询过程，但仍然依据完整工具结果回答。
const agent = new Agent({
  id: 'activity-stream',
  name: '活动查询助手',
  instructions: '用中文回答。先查 lookupReservation，说明教学数据来源。查询失败就如实说明，不重复相同查询。',
  model: 'vercel/openai/gpt-6.1-sol',
  tools: { lookupReservation: createReservationTool(process.argv[2] || '正常') }
})

try {
  const output = await agent.stream('查询预约编号 R001。', {
    maxSteps: 3,
    abortSignal: AbortSignal.timeout(60_000)
  })
  let interrupted = false
  for await (const chunk of output.fullStream) {
    if (chunk.type === 'text-delta') process.stdout.write(chunk.payload.text)
    if (chunk.type === 'tool-call' || chunk.type === 'tool-result') {
      console.log('\n工具事件：')
      console.dir(chunk, { depth: null })
    }
    if (chunk.type === 'error' || chunk.type === 'tripwire') {
      interrupted = true
      console.log('\n本次运行出现异常或被处理器拦截：')
      console.dir(chunk, { depth: null })
    }
  }
  console.log('\n结束原因：', await output.finishReason)
  console.log('已观察到异常或拦截：', interrupted)
  console.log('最终文本：', await output.text)
} catch (error) {
  console.error('流未能完整读取：', error instanceof Error ? error.message : error)
  process.exitCode = 1
}
