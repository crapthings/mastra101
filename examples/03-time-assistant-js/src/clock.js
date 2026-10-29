import { readTime } from './tools/read-time.js'

// 在不调用模型的情况下检查真实时间函数，也可传入无效时区观察失败。
const timeZone = process.argv[2] || 'Asia/Tokyo'
console.dir(readTime(timeZone), { depth: null })
