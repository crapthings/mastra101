import { Agent } from '@mastra/core/agent'

// 检查这个教学任务是否给出了指定编号，拦截不完整输入并观察最终输出。
const agent = new Agent({
  id: 'activity-processors',
  name: '活动材料检查助手',
  model: 'vercel/openai/gpt-6.1-sol',
  instructions: '用中文整理用户材料。编号只说明本次讨论对象，不证明预约已成功。',
  inputProcessors: [{
    id: 'require-demo-booking-id',
    processInput: ({ messages, abort }) => {
      const text = messages.filter(message => message.role === 'user')
        .flatMap(message => message.content.parts || [])
        .filter(part => part.type === 'text')
        .map(part => part.text).join('\n')
      if (!text.includes('R001')) abort('请补充本节使用的教学预约编号 R001。')
      return messages
    }
  }],
  outputProcessors: [{
    id: 'observe-final-output',
    processOutputResult: ({ messages, result }) => {
      console.log('最终输出检查：', { finishReason: result.finishReason, hasText: Boolean(result.text) })
      return messages
    }
  }]
})

// 缺少编号时由输入处理器拦截，不请求模型猜测编号。
const message = process.argv[2] === '缺少编号'
  ? '请整理这份活动资料。'
  : '预约编号 R001，地点还没有公布。请整理待确认事项。'

// 读取 tripwire，避免把被拦截当成正常回答。
const result = await agent.generate(message, { maxSteps: 1, abortSignal: AbortSignal.timeout(60_000) })
if (result.tripwire) {
  console.log('输入需要补充：', result.tripwire)
} else {
  console.log(result.text || '没有最终文本。')
}
