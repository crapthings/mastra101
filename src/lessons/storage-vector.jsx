import { Lesson } from './lesson'
import zh from '@/locales/lessons/storage-vector.zh.json'

// 按需加载存储章节的中文内容与本地教学示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='storage' number={5} previous='/storage/adapters' next='/storage/composite' />
}
