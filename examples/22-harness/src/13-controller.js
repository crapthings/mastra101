import { AgentController } from '@mastra/core/agent-controller'
import { createAssistant, createStorage } from './assistant.js'

// 用同一个控制器承载两种核查模式，每个会话保留自己的实时状态。
const storage = await createStorage('controller')
// 配置共享的会话控制器。
const controller = new AgentController({
  id: 'review-controller',
  agent: createAssistant(storage),
  storage,
  modes: [
    { id: 'plan', name: '核查计划', metadata: { default: true }, instructions: '先列出需核对的事实，不作报销结论。' },
    { id: 'review', name: '形成结论', instructions: '基于已有材料形成结论，同时指出尚未确认的事项。' }
  ]
})
// 保存订阅清理函数，避免退出后继续接收会话事件。
let unsubscribe

try {
  await controller.init()
  const session = await controller.createSession({ id: crypto.randomUUID(), resourceId: 'demo-user' })
  unsubscribe = session.subscribe(event => {
    if (event.type === 'message_update' && event.event.type === 'text-delta') {
      process.stdout.write(event.event.delta)
    }
  })
  await session.sendMessage({ content: '制度上限 500 元，超出须事先书面批准。申请金额 560 元，尚无批准记录。先列核查计划。' })
  await session.mode.switch({ modeId: 'review' })
  console.log('\n当前模式：', session.mode.get())
  await session.sendMessage({ content: '现在给出结论，保留待补材料。' })
  console.log()
} finally {
  unsubscribe?.()
  await controller.destroy()
  await storage.close()
}
