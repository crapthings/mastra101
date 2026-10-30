import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import { makeReviewer, makeCoordinator, logStep } from './shared.js'

// 只允许比较默认文本交接与完整结果交接。
const mode = process.argv[2] || '默认'
if (!['默认', '完整'].includes(mode)) throw new Error('请使用“默认”或“完整”。')
// 查询返回固定教学通知，给子任务一份可以追溯的来源。
const lookupNotice = createTool({
  id: 'lookup-notice', description: '读取本章教学活动通知。', inputSchema: z.object({}),
  execute: async () => ({ venue: '南门', startTime: '周六下午两点', source: '教学通知 v1', bookingStatus: '未提供个人记录' })
})
// 强制第一步查询、第二步回答，固定观察结果交接所需的路径。
const reviewer = makeReviewer({
  tools: { lookupNotice },
  instructions: '先读取教学通知，再用中文整理地点、开始时间、来源与个人预约状态缺口。',
  defaultOptions: {
    maxSteps: 2, onStepFinish: logStep('核对助手'),
    prepareStep: ({ stepNumber }) => ({ toolChoice: stepNumber === 0 ? { type: 'tool', toolName: 'lookupNotice' } : 'none' })
  }
})
// 主助手收到子任务结果后再组织回答。
const parent = makeCoordinator({ reviewer })
// 完整模式增加父模型可见的嵌套数据，不改变应用本就可检查的原始结果。
const result = await parent.generate('请让核对助手读取教学通知并说明安排。', {
  maxSteps: 3, abortSignal: AbortSignal.timeout(60000), onStepFinish: logStep('主助手'),
  delegation: {
    includeSubAgentToolResultsInModelContext: mode === '完整',
    onDelegationComplete: ({ result, success }) => {
      console.dir({ success, 子任务文本: result?.text, 嵌套工具: result?.subAgentToolResults }, { depth: 6 })
    }
  }
})
console.log(result.text)
