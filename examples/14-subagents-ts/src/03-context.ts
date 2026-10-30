import { RequestContext } from '@mastra/core/request-context'
import { activity, makeReviewer, makeCoordinator } from './shared.ts'

// 应用条件由独立请求上下文传入，不直接当作聊天历史。
const requestContext = new RequestContext()
requestContext.set('audience', '主助手')
// 动态指令读取这次委派得到的应用条件。
const reviewer = makeReviewer({
  instructions: ({ requestContext }) => `你面向${requestContext.get('audience')}核对资料，保留已确认与待确认，不补写事实。`
})
// 主会话包含一条无关的教学备注，子任务只需本次通知。
const parent = makeCoordinator({ reviewer })
// 同时控制历史消息与委派提示，避免只过滤一条输入路线。
const result = await parent.generate([
  { role: 'user', content: '教学备注：之前在讨论一份生日贺卡，与本次活动核对无关。' },
  { role: 'assistant', content: '这份贺卡讨论暂时结束。' },
  { role: 'user', content: `请核对活动通知：${activity}` }
], {
  requestContext, maxSteps: 3, abortSignal: AbortSignal.timeout(60000),
  delegation: {
    hookErrorStrategy: 'throw',
    onDelegationStart: context => {
      context.requestContext.set('audience', '活动参加者')
      return { modifiedPrompt: `只核对以下教学通知，按已确认和待确认整理：${activity}` }
    },
    messageFilter: ({ messages }) => {
      console.log('本次待筛选历史条数：', messages.length)
      return []
    }
  }
})
console.dir({ text: result.text, 主请求仍为: requestContext.get('audience') })
