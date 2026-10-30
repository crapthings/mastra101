import { resolve } from 'node:path'
import { z } from 'zod'

// 服务在启动时验证必要配置，错误信息不包含秘密值。
export function readConfig (env = process.env) {
  const schema = z.object({
    HOST: z.string().min(1).default('127.0.0.1'),
    PORT: z.coerce.number().int().min(0).max(65535).default(4111),
    DATA_DIR: z.string().min(1),
    API_AUTH_TOKEN: z.string().min(32),
    APP_VERSION: z.string().min(1).default('local'),
    SHUTDOWN_MS: z.coerce.number().int().min(100).max(30000).default(5000)
  })
  const result = schema.safeParse(env)
  if (!result.success) throw new Error(`启动配置不完整：${[...new Set(result.error.issues.map(issue => issue.path[0]))].join('、')}`)
  const value = result.data
  return { host: value.HOST, port: value.PORT, dataDir: resolve(value.DATA_DIR), token: value.API_AUTH_TOKEN, version: value.APP_VERSION, shutdownMs: value.SHUTDOWN_MS }
}
