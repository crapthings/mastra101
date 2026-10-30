import { Lesson } from './lesson'
import zh from '@/locales/lessons/skill-dynamic.zh.json'

// 按需加载技能章节的中文内容与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='skills' number={6} previous='/skills/resources' next='/skills/review' />
}
