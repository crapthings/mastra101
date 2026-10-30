import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/workflow-branch-flow.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'workflowBranchFlowDiagram', { content })

// 用图示说明本例让两条条件互斥。
export function WorkflowBranchFlowDiagram () {
  const { t } = useTranslation('workflowBranchFlowDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={400} label={d.caption}>{marker => <>
    <Node x={100} y={10} width={400} title={d.input} subtitle={d.inputDetail} active />
    <Arrow d='M 300 74 V 115 H 155 V 168' marker={marker} label={d.yes} x={215} y={145} />
    <Arrow d='M 300 74 V 115 H 445 V 168' marker={marker} label={d.no} x={385} y={145} />
    <Node x={25} y={170} width={260} title={d.ready} subtitle={d.readyDetail} />
    <Node x={315} y={170} width={260} title={d.missing} subtitle={d.missingDetail} />
    <Arrow d='M 155 234 V 275 H 300 V 318' marker={marker} />
    <Arrow d='M 445 234 V 275 H 300 V 318' marker={marker} />
    <Node x={65} y={320} width={470} title={d.output} subtitle={d.outputDetail} active />
  </>}</DiagramSvg></DiagramFrame>
}
