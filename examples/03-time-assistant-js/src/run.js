import { timeAgent } from './agents/time-agent.js'
import { checkConfig } from './config.js'

// 调用助手并打印实际的工具请求、工具结果与最终回答。
async function main () {
  checkConfig()
  const timeZone = process.argv[2] || 'Asia/Tokyo'
  let stepCount = 0
  let toolCallCount = 0
  const result = await timeAgent.generate(
    `请查询当前时间。用户提供的时区是：${timeZone}。请原样使用这个时区。`,
    {
      maxSteps: 3,
      abortSignal: AbortSignal.timeout(60_000),
      onStepFinish: ({ toolCalls, toolResults, finishReason }) => {
        stepCount += 1
        toolCallCount += toolCalls?.length || 0
        console.log(`第 ${stepCount} 步`)
        console.dir({ toolCalls, toolResults, finishReason }, { depth: null })
      }
    }
  )
  console.log('最终回答：')
  console.log(result.text || '没有最终文本；可能已达到步数上限，请查看上面的执行记录。')
  if (toolCallCount === 0) {
    console.log('本次没有观察到工具调用，不能将回答当作已验证的时间查询。')
  }
}

main().catch(error => {
  console.error('调用失败：', error.message)
  process.exitCode = 1
})
