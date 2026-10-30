import { checks } from '@mastra/evals/checks'

// 两条人工保存的回答用于观察字符串检查的判断范围，不调用智能体。
const answers = ['请从南门入场。', '入口尚未公布，请不要按南门安排出发。']
// 关键词存在只是一项局部检查，两条回答都会得到 1 分。
const scorer = checks.includes('南门')
for (const text of answers) {
  const result = await scorer.run({ output: [{
    id: 'saved-answer', role: 'assistant',
    content: { format: 2, parts: [{ type: 'text', text }] }
  }] })
  console.log('回答：', text, '关键词检查：', result.score)
}
