import { Lesson } from './lesson'
import zh from '@/locales/lessons/workspace-files.zh.json'

// 按需加载工作区章节的中文内容与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='workspace' number={3} previous='/workspace/paths' next='/workspace/search' />
}
