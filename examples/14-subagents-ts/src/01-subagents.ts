import { activity, makeReviewer, makeCoordinator, logStep } from './shared.ts'

// 注册键 reviewer 决定主助手看到的委派工具名称。
const reviewer = makeReviewer()
// agents 提供子智能体，主助手的指令说明何时委派。
const parent = makeCoordinator({ reviewer })
// 一次父运行包含委派、子任务处理和父任务继续生成。
const result = await parent.generate(`请核对这份通知：${activity}`, {
  maxSteps: 3, abortSignal: AbortSignal.timeout(60000), onStepFinish: logStep('主助手')
})
console.dir({ text: result.text, finishReason: result.finishReason })
