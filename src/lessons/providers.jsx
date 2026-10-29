import { ProviderPathDiagram } from '@/diagrams/provider-path'
import { Lesson } from './lesson'
import zh from '@/locales/lessons/providers.zh.json'

// This route introduces provider selection before environment configuration.
export function Component () {
  return <Lesson resources={{ zh }} chapter='agent' Diagram={ProviderPathDiagram} diagramAfterSection={3} number={1} previous='/framework/mastra' next='/agent/setup' />
}
