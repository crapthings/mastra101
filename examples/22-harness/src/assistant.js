import { mkdir } from 'node:fs/promises'
import { Agent } from '@mastra/core/agent'
import { Memory } from '@mastra/memory'
import { LibSQLStore } from '@mastra/libsql'

// 为每个独立入口准备本地存储，保留线程和运行记录。
export async function createStorage (name) {
  await mkdir('./data', { recursive: true })
  return new LibSQLStore({ id: name, url: `file:./data/${name}.db` })
}

// 创建核查助手，并允许各入口补充本节需要的能力。
export function createAssistant (storage, options = {}) {
  return new Agent({
    id: 'policy-reviewer',
    name: '制度核查助手',
    instructions: '核查给出的制度材料，列明结论、依据与待确认事项。只使用提供的事实，不编造核查结果。',
    model: 'vercel/openai/gpt-6.1-sol',
    memory: new Memory({ storage, options: { lastMessages: 12 } }),
    ...options
  })
}
