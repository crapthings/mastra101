import { MastraClient } from '@mastra/client-js'
import { createLab } from './lab.ts'

// 此入口通过本地服务请求模型，逐块读取文本并检查结束事件。
const lab = await createLab()
try {
  const client = new MastraClient({ baseUrl: lab.baseUrl, retries: 0 })
  const response = await client.getAgent('notice-helper').stream('场馆通知：入口尚未公布。请整理一句入场提醒。')
  let text = ''
  let finished = false
  await response.processDataStream({ onChunk: async chunk => {
    if (chunk.type === 'text-delta') {
      text += chunk.payload.text
      console.log('收到文字：', chunk.payload.text)
    }
    if (chunk.type === 'error') throw new Error('服务端返回流错误，请核对服务端运行记录')
    if (chunk.type === 'finish') finished = true
  } })
  console.log('文本：', text, '收到结束事件：', finished)
  if (!finished) throw new Error('响应流未收到结束事件，不能认定任务已完成')
} finally {
  await lab.close()
}
