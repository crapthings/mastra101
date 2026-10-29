import { Agent } from '@mastra/core/agent'

// 强制拦截用于观察处理器重试上限，不代表真实模型一定会答错。
const forceReject = process.argv[2] === '强制拦截'

// 分开设置模型请求重试和输出检查反馈的重试，不重跑外部业务操作。
const agent = new Agent({
  id: 'activity-recovery',
  name: '活动结果检查助手',
  model: 'vercel/openai/gpt-6.1-sol',
  instructions: '用中文整理活动资料。地点未知时明确写“待确认”。',
  maxRetries: 2,
  maxProcessorRetries: 1,
  errorProcessorDefaults: false,
  outputProcessors: [{
    id: 'require-pending-label',
    processOutputStep: ({ messages, text, abort }) => {
      const accepted = !forceReject && Boolean(text?.includes('待确认'))
      if (!accepted) abort('结果未通过检查，请保留“待确认”标记。', { retry: true })
      return messages
    }
  }]
})

try {
  const result = await agent.generate('活动周六下午两点开始，地点尚未公布。请整理安排。', {
    maxSteps: 1,
    modelSettings: { timeout: { totalMs: 60_000 } }
  })
  if (result.tripwire) {
    console.log('检查仍未通过，不交付为已完成结果：', result.tripwire)
  } else {
    console.log(result.text || '没有可交付的最终文本。')
  }
  console.log('结束原因：', result.finishReason)
} catch (error) {
  console.error('运行未完成，保留错误并决定下一步：', error instanceof Error ? error.message : error)
  process.exitCode = 1
}
