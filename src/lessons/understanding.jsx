import { Lesson } from './lesson'
import zh from '@/locales/lessons/understanding.zh.json'

// 按需加载框架体系末尾的 Mastra 介绍。
export function Component () {
  return <Lesson resources={{ zh }} chapter='framework' number={7} previous='/framework/organization' next='/agent/providers' />
}
