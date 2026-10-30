import { HarnessNotificationDiagram } from '@/diagrams/harness-notification'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/harness-notifications.zh.json'

// 按需加载持续执行的概念、图示与对应练习。
export function Component () {
  return <Lesson resources={{ zh }} chapter='harness' number={10} previous='/harness/background' next='/harness/providers' Diagram={HarnessNotificationDiagram} diagramAfterSection={1} />
}
