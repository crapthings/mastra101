import { z } from 'zod'

// Embedding 与生成模型各有用途，这里通过同一 Vercel 网关请求向量。
export const embeddingModel = 'openai/text-embedding-3-small'
// 校验返回位置、数量与维数，避免把错位向量写入片段。
const responseSchema = z.object({ data: z.array(z.object({ index: z.number().int().nonnegative(), embedding: z.array(z.number().finite()).min(1) })) })

// 原生 HTTP 示例直接展示输入文本到数值向量的接口边界。
export async function embedTexts (texts) {
  if (!process.env.AI_GATEWAY_API_KEY) throw new Error('请先设置 AI_GATEWAY_API_KEY')
  if (!texts.length) return []
  const response = await fetch('https://ai-gateway.vercel.sh/v1/embeddings', {
    method: 'POST', signal: AbortSignal.timeout(30000),
    headers: { Authorization: `Bearer ${process.env.AI_GATEWAY_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: embeddingModel, input: texts })
  })
  if (!response.ok) throw new Error(`向量请求失败，HTTP 状态：${response.status}`)
  const { data } = responseSchema.parse(await response.json())
  const ordered = data.sort((a, b) => a.index - b.index)
  const dimension = ordered[0]?.embedding.length
  if (ordered.length !== texts.length || ordered.some((item, i) => item.index !== i || item.embedding.length !== dimension)) throw new Error('向量数量、顺序或维数与输入不一致')
  return ordered.map(item => item.embedding)
}
