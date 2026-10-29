import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/agent-approval-flow.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'agentApprovalFlowDiagram', { content })

// 展示暂停后的批准与拒绝分支，区分授权和执行结果。
export function AgentApprovalFlowDiagram () {
  const { t } = useTranslation('agentApprovalFlowDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={450} label={d.caption}>{marker => <>
    <Node x={90} y={10} width={420} title={d.request} subtitle={d.requestDetail} />
    <Arrow d='M 300 74 V 118' marker={marker} />
    <Node x={90} y={120} width={420} title={d.pending} subtitle={d.pendingDetail} active />
    <Arrow d='M 300 184 V 212 H 150 V 248' marker={marker} />
    <Arrow d='M 300 184 V 212 H 450 V 248' marker={marker} />
    <Node x={20} y={250} width={260} title={d.approve} subtitle={d.approveDetail} />
    <Node x={320} y={250} width={260} title={d.decline} subtitle={d.declineDetail} />
    <Arrow d='M 150 314 V 368' marker={marker} />
    <Arrow d='M 450 314 V 368' marker={marker} />
    <Node x={20} y={370} width={260} title={d.execute} subtitle={d.executeDetail} />
    <Node x={320} y={370} width={260} title={d.explain} subtitle={d.explainDetail} />
  </>}</DiagramSvg></DiagramFrame>
}
