import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/connection-approval-flow.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'connectionApprovalFlowDiagram', { content })

// 用图示说明外部能力的请求路径、审批或任务交接。
export function ConnectionApprovalFlowDiagram () {
  const { t } = useTranslation('connectionApprovalFlowDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={500} label={d.caption}>{marker => <>
    <Node x={65} y={10} width={470} title={d.request} subtitle={d.requestDetail} />
    <Arrow d='M 300 74 V 118' marker={marker} />
    <Node x={65} y={120} width={470} title={d.pending} subtitle={d.pendingDetail} active />
    <Arrow d='M 300 184 V 220 H 150 V 258' marker={marker} />
    <Arrow d='M 300 184 V 220 H 450 V 258' marker={marker} />
    <Node x={15} y={260} width={270} title={d.deny} subtitle={d.denyDetail} />
    <Node x={315} y={260} width={270} title={d.approve} subtitle={d.approveDetail} active />
    <path d='M 15 370 H 585' fill='none' stroke='#d6d3d1' strokeDasharray='5 5' />
    <text x='175' y='359' textAnchor='middle' fill='#57534e' fontSize='13'>{d.boundary}</text>
    <Arrow d='M 450 324 V 408' marker={marker} />
    <Node x={245} y={410} width={340} title={d.save} subtitle={d.saveDetail} active />
  </>}</DiagramSvg></DiagramFrame>
}
