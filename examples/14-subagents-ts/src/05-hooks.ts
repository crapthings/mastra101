import { activity, makeReviewer, makeCoordinator } from './shared.ts'

// 三种模式分别观察允许委派、主动拒绝与钩子抛错。
const mode = process.argv[2] || '允许'
if (!['允许', '拒绝', '钩子错误'].includes(mode)) throw new Error('请使用“允许”“拒绝”或“钩子错误”。')
// 子助手只执行资料核对，不写入外部系统。
const parent = makeCoordinator({ reviewer: makeReviewer() })
try {
  const result = await parent.generate(`请核对：${activity}`, {
    maxSteps: 3, abortSignal: AbortSignal.timeout(60000),
    delegation: {
      hookErrorStrategy: 'throw',
      onDelegationStart: ({ primitiveId, prompt }) => {
        console.dir({ 委派对象: primitiveId, 委派任务: prompt })
        if (mode === '钩子错误') throw new Error('教学检查器暂时不可用')
        if (mode === '拒绝') return { proceed: false, rejectionReason: '本轮暂不运行核对助手，请保留未核对状态。' }
        return { proceed: true, modifiedPrompt: `${prompt}\n请保留个人预约状态缺失这一项。` }
      },
      onDelegationComplete: context => {
        console.dir({ success: context.success, finishReason: context.result?.finishReason })
        if (!context.success) {
          context.bail()
          return { resultText: '子任务未完成，活动资料仍待核对。' }
        }
      }
    }
  })
  console.dir({ text: result.text, finishReason: result.finishReason })
} catch (error) {
  console.error('本次任务未能正常交付：', error.message)
  process.exitCode = 1
}
