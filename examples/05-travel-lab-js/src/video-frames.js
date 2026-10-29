import { readFile } from 'node:fs/promises'
import { travelAgent } from './mastra/agents/travel-agent.js'
import { checkConfig } from './config.js'

// 发送按时间排列的教学画面，检查模型能否区分画面事实与推断。
async function main () {
  checkConfig()
  const bytes = await readFile(new URL('../materials/video-frames.png', import.meta.url))
  const result = await travelAgent.generate([{
    role: 'user',
    content: [
      {
        type: 'text',
        text: '这是一段无声教学视频在 00:00、00:02、00:04 的三张画面，按时间从上到下排列。请按时间列出各画面明确显示的地点和方向信息，区分画面事实与推断。说明这些画面是否足以证明实际步行耗时或全程无障碍；没有依据时写无法确认。'
      },
      {
        type: 'image',
        image: `data:image/png;base64,${bytes.toString('base64')}`,
        mimeType: 'image/png'
      }
    ]
  }], {
    maxSteps: 1,
    abortSignal: AbortSignal.timeout(60_000)
  })
  console.log(result.text || '本次没有最终文本，请检查调用结果。')
}

main().catch(error => {
  console.error('分析教学画面失败：', error.message)
  process.exitCode = 1
})
