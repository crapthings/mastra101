import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/workflow-suspend-flow.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'workflowSuspendFlowDiagram', { content })

// 用图示说明同一运行，先等资料，再等确认。
export function WorkflowSuspendFlowDiagram () {
  const { t } = useTranslation('workflowSuspendFlowDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={610} label={d.caption}>{marker => <>
    <Node x={55} y={10} width={490} title={d.details} subtitle={d.detailsDetail} />
    <Arrow d='M 300 74 V 128' marker={marker} />
    <Node x={55} y={130} width={490} title={d.resumeDetails} subtitle={d.resumeDetailsDetail} active />
    <Arrow d='M 300 194 V 248' marker={marker} />
    <Node x={55} y={250} width={490} title={d.confirm} subtitle={d.confirmDetail} />
    <Arrow d='M 300 314 V 368' marker={marker} />
    <Node x={55} y={370} width={490} title={d.resumeConfirm} subtitle={d.resumeConfirmDetail} active />
    <Arrow d='M 300 434 V 470 H 155 V 518' marker={marker} />
    <Arrow d='M 300 434 V 470 H 445 V 518' marker={marker} />
    <Node x={20} y={520} width={270} title={d.saved} />
    <Node x={310} y={520} width={270} title={d.declined} />
  </>}</DiagramSvg></DiagramFrame>
}
