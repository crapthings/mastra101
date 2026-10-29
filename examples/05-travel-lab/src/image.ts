import { readFile } from 'node:fs/promises'
import { travelAgent } from './mastra/agents/travel-agent.ts'
import { checkConfig } from './config.ts'

// 将练习图片的实际字节与问题一起发送，避免只传本地路径。
async function main () {
  checkConfig()
  const bytes = await readFile(new URL('../materials/hotel-order.png', import.meta.url))
  const result = await travelAgent.generate([{
    role: 'user',
    content: [
      {
        type: 'text',
        text: '请读取这张教学订单，列出酒店、入住日期、离店日期、人数和早餐信息；为每项附上图中依据。看不清或未写明的内容标为待确认，不推测。'
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
  console.error('读取图片失败：', error.message)
  process.exitCode = 1
})
