import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/connection-a2a-flow.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'connectionA2AFlowDiagram', { content })

// 用图示说明外部能力的请求路径、审批或任务交接。
export function ConnectionA2AFlowDiagram () {
  const { t } = useTranslation('connectionA2AFlowDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={395} label={d.caption}>{marker => <>
    <Node x={65} y={10} width={470} title={d.card} subtitle={d.cardDetail} />
    <Arrow d='M 300 74 V 118' marker={marker} />
    <Node x={65} y={120} width={470} title={d.send} subtitle={d.sendDetail} active />
    <Arrow d='M 300 184 V 235 H 100 V 288' marker={marker} />
    <Arrow d='M 300 184 V 288' marker={marker} />
    <Arrow d='M 300 184 V 235 H 500 V 288' marker={marker} />
    <Node x={10} y={290} width={180} title={d.done} subtitle={d.doneDetail} />
    <Node x={210} y={290} width={180} title={d.wait} subtitle={d.waitDetail} />
    <Node x={410} y={290} width={180} title={d.failed} subtitle={d.failedDetail} />
  </>}</DiagramSvg></DiagramFrame>
}
