// 检查 Vercel AI Gateway 密钥，避免在缺少配置时发出请求。
export function checkConfig () {
  const key = process.env.AI_GATEWAY_API_KEY
  if (!key || key === '请填写你的密钥') {
    throw new Error('请先复制 .env.example 为 .env，并填写 AI_GATEWAY_API_KEY。')
  }
}
