import { rerank } from '@mastra/rag'
import { ModelRouterLanguageModel } from '@mastra/core/llm'

// 只对已授权候选重排；模型判断、向量相似度与原始位置的权重明确分开。
export async function rankCandidates (question, candidates) {
  if (!candidates.length) return []
  const model = new ModelRouterLanguageModel('vercel/openai/gpt-6.1-sol')
  return rerank(candidates, question, model, { weights: { semantic: 0.7, vector: 0.3, position: 0 }, topK: 3 })
}
