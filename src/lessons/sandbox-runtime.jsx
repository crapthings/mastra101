import { Lesson } from './lesson'
import zh from '@/locales/lessons/sandbox-runtime.zh.json'

// 按需加载沙箱章节的中文内容与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='sandbox' number={1} previous='/workspace/artifacts' next='/sandbox/results' />
}
