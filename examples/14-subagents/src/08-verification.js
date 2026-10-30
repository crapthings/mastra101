import { Agent } from '@mastra/core/agent'
import { model, activity, makeReviewer, makeCoordinator, logStep } from './shared.js'

// 保留同一套任务，比较资料齐全、缺少地点与委派失败。
const mode = process.argv[2] || '正常'
if (!['正常', '缺少地点', '委派失败'].includes(mode)) throw new Error('请使用“正常”“缺少地点”或“委派失败”。')
// 仅修改资料中的地点，不改变核对标准。
const material = mode === '缺少地点' ? activity.replace('南门进入', '地点尚未公布') : activity
// 每次任务单独记录阶段，只有已完成的核对才允许进入文案阶段。
const completed = new Set()
// 核对助手先处理事实与缺口。
const reviewer = makeReviewer()
// 文案助手只处理交接结果，不添加新规定。
const writer = new Agent({
  id: 'reminder-writer', name: '提醒文案助手', model,
  description: '把核对结果写成简短提醒，保留待确认事项，不查询新事实。',
  instructions: '根据收到的核对结果写一条中文提醒，不增加地点、入场规定或已预约声明。',
  defaultOptions: { maxSteps: 1 }
})
// 主助手按职责委派，两阶段是否真的完成由下方程序记录核对。
const parent = makeCoordinator({ reviewer, writer }, {
  instructions: '先委派 reviewer 核对，再把核对结果交给 writer 编写提醒。可用 contextFromRefs 引用先前结果，最后向用户交付提醒和待确认事项。任何阶段未完成都应如实说明。'
})
// 结果引用保留本次运行内的文本交接，不能替代持久存储与事实检查。
const result = await parent.generate(`整理参加活动前的提醒：${material}`, {
  maxSteps: 4, abortSignal: AbortSignal.timeout(60000), onStepFinish: logStep('主助手'),
  delegation: {
    enableResultReferences: true, hookErrorStrategy: 'throw',
    onDelegationStart: ({ primitiveId }) => {
      if (primitiveId === reviewer.id && mode === '委派失败') throw new Error('教学核对阶段不可用')
      if (primitiveId === writer.id && !completed.has(reviewer.id)) return { proceed: false, rejectionReason: '尚未取得完整核对结果，暂不编写提醒。' }
      return { proceed: true }
    },
    onDelegationComplete: context => {
      if (context.success && context.result?.finishReason === 'stop' && context.result.text?.trim()) completed.add(context.primitiveId)
      if (!context.success) {
        context.bail()
        return { resultText: '这次子任务失败，尚未形成可交付提醒。' }
      }
    }
  }
})
console.dir({ 已完成阶段: [...completed], text: result.text, finishReason: result.finishReason })
if (!completed.has(reviewer.id) || !completed.has(writer.id)) {
  console.error('缺少完整的核对或文案交接，本轮不标记为提醒已完成。')
  process.exitCode = 1
}
