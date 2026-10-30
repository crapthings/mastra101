import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/memory-context-flow.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'memoryContextFlowDiagram', { content })

// 用图示说明记忆怎样参与下一次回答。
export function MemoryContextFlowDiagram () {
  const { t } = useTranslation('memoryContextFlowDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={470} label={d.caption}>{marker => <>
    <Node x={100} y={10} width={400} title={d.store} subtitle={d.storeDetail} />
    <Arrow d='M 300 74 V 118' marker={marker} />
    <Node x={100} y={120} width={400} title={d.select} subtitle={d.selectDetail} active />
    <Arrow d='M 300 184 V 228' marker={marker} />
    <Node x={100} y={230} width={400} title={d.input} subtitle={d.inputDetail} active />
    <Arrow d='M 300 294 V 338' marker={marker} />
    <Node x={100} y={340} width={400} title={d.model} subtitle={d.modelDetail} />
    <Arrow d='M 500 372 H 565 V 42 H 502' marker={marker} />
    <text x='300' y='445' textAnchor='middle' fontSize='14' fill='#57534e'>{d.save}</text>
    <path d='M 475 440 H 565 V 372' stroke='#a8a29e' strokeDasharray='4 4' fill='none' />
  </>}</DiagramSvg></DiagramFrame>
}
