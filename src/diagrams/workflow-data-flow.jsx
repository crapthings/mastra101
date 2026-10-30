import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/workflow-data-flow.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'workflowDataFlowDiagram', { content })

// 用图示说明顺序由流程定义，数据逐步交接。
export function WorkflowDataFlowDiagram () {
  const { t } = useTranslation('workflowDataFlowDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={435} label={d.caption}>{marker => <>
    <Node x={65} y={10} width={470} title={d.normalize} subtitle={d.normalizeDetail} />
    <Arrow d='M 300 74 V 118' marker={marker} />
    <Node x={65} y={120} width={470} title={d.mapping} subtitle={d.mappingDetail} active />
    <Arrow d='M 300 184 V 228' marker={marker} />
    <Node x={65} y={230} width={470} title={d.prepare} subtitle={d.prepareDetail} />
    <Arrow d='M 300 294 V 338' marker={marker} />
    <Node x={65} y={340} width={470} title={d.deliver} subtitle={d.deliverDetail} active />
  </>}</DiagramSvg></DiagramFrame>
}
