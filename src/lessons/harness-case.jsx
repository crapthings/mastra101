import { Lesson } from './lesson'
import zh from '@/locales/lessons/harness-case.zh.json'

// 用同一申请的跨进程材料更新与报告交付完成持续执行主线。
export function Component () {
  return <Lesson resources={{ zh }} chapter='harness' number={16} previous='/harness/tasks' />
}
