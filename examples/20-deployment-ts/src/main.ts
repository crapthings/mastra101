import { readConfig } from './config.ts'
import { startService } from './runtime.ts'

// 入口只在配置通过后启动，安装进程信号处理并报告可访问地址。
const config = readConfig()
// 服务实例负责初始化、后台机制和资源关闭。
const service = await startService(config)
// 信号触发同一个可重复调用的关闭过程，错误只报告必要信息。
const stop = signal => { service.close(signal).catch(() => { console.error('服务关闭失败'); process.exitCode = 1 }) }
process.once('SIGTERM', () => stop('SIGTERM'))
process.once('SIGINT', () => stop('SIGINT'))
console.log(JSON.stringify({ event: 'service.ready', address: service.address, version: config.version }))
