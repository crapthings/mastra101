import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import { makeReviewer, makeCoordinator, logStep } from './shared.js'

// 数字模式比较子任务步数，覆盖模式演示程序改预算，取消模式观察信号。
const mode = process.argv[2] || '2'
if (!['1', '2', '覆盖', '取消'].includes(mode)) throw new Error('请使用“1”“2”“覆盖”或“取消”。')
// 一个控制器负责向父运行及正在执行的子运行发送取消信号。
const controller = new AbortController()
// 查询只返回本地教学数据，取消模式在执行中触发信号。
const lookup = createTool({
  id: 'lookup', description: '读取教学入口。', inputSchema: z.object({}),
  execute: async (_input, context) => {
    if (mode === '取消') controller.abort()
    console.dir({ 工具收到取消: context.abortSignal?.aborted })
    return { venue: '南门', source: '教学通知' }
  }
})
// 子任务先查询再整理，默认预算为一步或两步。
const reviewer = makeReviewer({
  tools: { lookup }, instructions: '查询教学入口，再根据工具结果回答并注明来源。',
  defaultOptions: {
    maxSteps: mode === '1' || mode === '覆盖' ? 1 : 2,
    onStepFinish: logStep('核对助手'),
    prepareStep: ({ stepNumber }) => ({ toolChoice: stepNumber === 0 ? { type: 'tool', toolName: 'lookup' } : 'none' })
  }
})
// 父运行的预算与子运行分开设置。
const parent = makeCoordinator({ reviewer })
try {
  const result = await parent.generate('委派核对助手查询教学入口，取得结果后如实回答。', {
    maxSteps: 2, abortSignal: AbortSignal.any([controller.signal, AbortSignal.timeout(60000)]),
    onStepFinish: logStep('主助手'),
    prepareStep: ({ stepNumber }) => ({ toolChoice: stepNumber === 0 ? { type: 'tool', toolName: 'agent-reviewer' } : 'none' }),
    delegation: {
      onDelegationStart: () => mode === '覆盖' ? { modifiedMaxSteps: 2 } : { proceed: true },
      onDelegationComplete: ({ result }) => {
        console.dir({ 子任务结束原因: result?.finishReason, 子任务文本: result?.text })
        if (!result?.text?.trim()) return { resultText: '子任务没有形成最终文字。可能已有查询结果，请保留未完成状态并检查记录。' }
      }
    }
  })
  console.dir({ text: result.text, 已发出取消: controller.signal.aborted })
} catch (error) {
  console.error('运行中断或失败：', error.message)
  process.exitCode = 1
}
