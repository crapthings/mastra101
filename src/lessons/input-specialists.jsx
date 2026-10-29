import { Lesson } from './lesson'
import zh from '@/locales/lessons/input-specialists.zh.json'

// 按需加载模型分工与能力边界的中文内容。
export function Component () {
  return <Lesson resources={{ zh }} chapter='modalities' number={12} previous='/modalities/planning' next='/modalities/world-models' />
}
