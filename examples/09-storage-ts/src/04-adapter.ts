import { LibSQLStore } from '@mastra/libsql'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

// 先把相对路径解析为绝对文件位置，便于不同进程核对同一个数据库。
const databasePath = resolve(process.argv[2] || './04-adapter.db')
// 文件 URL 由路径转换，避免空格等字符被手工拼接错误。
const databaseUrl = pathToFileURL(databasePath).href
// id 标识适配器，url 才决定这个本地数据库的实际位置。
const storage = new LibSQLStore({ id: 'local-adapter', url: databaseUrl })
await storage.init()
console.log('数据库绝对路径：', databasePath)
console.log('实际连接位置：', databaseUrl)
console.log('初始化后 memory 接口可用：', Boolean(await storage.getStore('memory')))
