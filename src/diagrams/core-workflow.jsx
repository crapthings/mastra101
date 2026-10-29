import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/core-workflow.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'coreWorkflowDiagram', { content })

// 用静态关系图解释固定流程中，可以有一个 Agent 步骤，不执行模型或外部操作。
export function CoreWorkflowDiagram () {
  const { t } = useTranslation('coreWorkflowDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={485} label={d.caption}>{marker => <>

    <rect x='35' y='10' width='530' height='460' rx='14' fill='none' stroke='#a8a29e' strokeDasharray='5 5' />
    <text x='300' y='40' textAnchor='middle' fontSize='14' fill='#57534e'>{d.frame}</text>
    <Node x={100} y={65} width={400} title={d.check} subtitle={d.checkDetail} />
    <Arrow d='M 300 129 V 198' marker={marker} label={d.input} x={405} y={168} />
    <Node x={100} y={200} width={400} title={d.agent} subtitle={d.agentDetail} active />
    <text x='300' y='291' textAnchor='middle' fontSize='13' fill='#57534e'>{d.inside}</text>
    <Arrow d='M 300 305 V 363' marker={marker} label={d.result} x={420} y={339} />
    <Node x={100} y={365} width={400} title={d.output} subtitle={d.outputDetail} />
  </>}</DiagramSvg></DiagramFrame>
}
