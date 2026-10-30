import { makeService } from './service.js'

// 标准输出留给 MCP 协议，不在这里打印普通日志。
const server = makeService()
await server.startStdio()
