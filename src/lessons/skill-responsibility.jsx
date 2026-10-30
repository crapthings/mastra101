import { Lesson } from './lesson'
import zh from '@/locales/lessons/skill-responsibility.zh.json'

// 按需加载技能章节的中文内容与独立示例。
export function Component () {
  return <Lesson resources={{ zh }} chapter='skills' number={1} previous='/workflows/agents' next='/skills/definition' />
}
