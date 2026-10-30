import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/memory-observation-flow.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'memoryObservationFlowDiagram', { content })

// 用图示说明先整理对话，再整理观察。
export function MemoryObservationFlowDiagram () {
  const { t } = useTranslation('memoryObservationFlowDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={460} label={d.caption}>{marker => <>
    <Node x={25} y={10} width={320} title={d.raw} subtitle={d.rawDetail} />
    <Arrow d='M 185 74 V 108' marker={marker} />
    <Node x={25} y={110} width={320} title={d.observer} subtitle={d.observerDetail} active />
    <Arrow d='M 185 174 V 218' marker={marker} />
    <Node x={25} y={220} width={320} title={d.log} subtitle={d.logDetail} active />
    <Arrow d='M 345 240 H 378' marker={marker} />
    <Node x={380} y={220} width={200} title={d.reflector} subtitle={d.reflectorDetail} />
    <Arrow d='M 480 284 V 325 H 325 V 286' marker={marker} />
    <Arrow d='M 185 284 V 368' marker={marker} />
    <Node x={25} y={370} width={530} title={d.model} subtitle={d.modelDetail} />
  </>}</DiagramSvg></DiagramFrame>
}
