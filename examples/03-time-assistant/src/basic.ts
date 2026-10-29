import { Agent } from '@mastra/core/agent'
import { checkConfig } from './config.ts'

// 创建尚未配置查询工具的时间助手。
const agent = new Agent({
  id: 'time-guide-basic',
  name: '旅行时间助手',
  instructions: '用中文回答。没有当前时间的可靠来源时，说明缺少信息，不要猜测。',
  model: 'vercel/openai/gpt-6.1-sol'
})

// 完成一次不带工具的调用，观察模型如何处理缺少的实时信息。
async function main () {
  checkConfig()
  const result = await agent.generate('现在东京几点？时区是 Asia/Tokyo。', {
    maxSteps: 1,
    abortSignal: AbortSignal.timeout(60_000)
  })
  console.log(result.text || '本次没有生成最终文本。')
}

main().catch(error => {
  console.error('调用失败：', error.message)
  process.exitCode = 1
})
