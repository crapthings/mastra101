import { embedTexts, embeddingModel } from './embedding.js'

// 入库文字和问题可以写法不同，仍需使用兼容的同一向量空间。
const texts = ['甲团队到北京出差，住宿上限每晚 500 元。', '去北京住酒店一晚能报多少？']
// 只打印尺寸，不把完整向量当成可供人阅读的解释。
const vectors = await embedTexts(texts)
console.log('向量模型：', embeddingModel)
console.table(vectors.map((vector, i) => ({ text: texts[i], dimension: vector.length })))
