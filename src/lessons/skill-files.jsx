import { Lesson } from './lesson'
import zh from '@/locales/lessons/skill-files.zh.json'

// 按需加载技能章节的中文内容与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='skills' number={4} previous='/skills/loading' next='/skills/resources' />
}
