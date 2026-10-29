import { Agent } from '@mastra/core/agent'
import { createReservationTool } from './reservation.ts'
import { z } from 'zod'

// 对运行步数作确定性校验，避免把无效设置传给框架。
const maxSteps = z.coerce.number().int().min(1).max(3).parse(process.argv[2] || '3')

// 选择是否在工具返回后停止，观察停止条件与最终回答的区别。
const stopAfterQuery = process.argv[3] === '查完即停'

// 使用正常教学查询观察不同执行上限，不允许反复查询同一编号。
const agent = new Agent({
  id: 'activity-control',
  name: '活动查询助手',
  model: 'vercel/openai/gpt-6.1-sol',
  instructions: '先调用 lookupReservation 查询 R001，再用中文说明教学结果。不要重复调用相同参数。',
  tools: { lookupReservation: createReservationTool() }
})

// 在请求进行时接收终端中止，工具若有外部 I/O 也需要配合取消信号。
const controller = new AbortController()
// 将 Ctrl+C 转为本次请求的取消信号。
const stop = () => controller.abort()
process.once('SIGINT', stop)

try {
  const result = await agent.generate('请查询预约编号 R001。', {
    maxSteps,
    prepareStep: ({ stepNumber }) => stepNumber === 0
      ? { toolChoice: { type: 'tool', toolName: 'lookupReservation' } }
      : { toolChoice: 'none' },
    stopWhen: stopAfterQuery
      ? ({ steps }) => steps.some(step => (step.toolResults?.length || 0) > 0)
      : undefined,
    abortSignal: AbortSignal.any([controller.signal, AbortSignal.timeout(60_000)]),
    onStepFinish: ({ toolCalls, toolResults, finishReason }) => {
      console.dir({ toolCalls, toolResults, finishReason }, { depth: null })
    }
  })
  console.log('结束原因：', result.finishReason)
  console.log('最终文本：', result.text || '本次没有最终文本。')
  console.log('请对照步骤记录判断任务完成情况。')
} catch (error) {
  console.error('运行未正常完成：', error instanceof Error ? error.message : error)
  process.exitCode = 1
} finally {
  process.removeListener('SIGINT', stop)
}
