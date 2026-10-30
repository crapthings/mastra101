import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/subagent-budget-flow.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'subagentBudgetFlowDiagram', { content })

// 用独立图示解释子任务的输入、交接或运行范围。
export function SubagentBudgetFlowDiagram () {
  const { t } = useTranslation('subagentBudgetFlowDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={460} label={d.caption}>{marker => <>
    <rect x='15' y='10' width='570' height='438' rx='12' fill='none' stroke='#a8a29e' strokeDasharray='5 5' />
    <text x='300' y='34' textAnchor='middle' fill='#57534e' fontSize='14'>{d.scope}</text>
    <Node x={65} y={55} width={470} title={d.delegate} subtitle={d.delegateDetail} />
    <rect x='25' y='135' width='550' height='140' rx='10' fill='none' stroke='#d6d3d1' strokeDasharray='4 4' />
    <text x='300' y='150' textAnchor='middle' fill='#57534e' fontSize='13'>{d.childScope}</text>
    <Arrow d='M 150 119 V 178' marker={marker} />
    <Node x={35} y={180} width={240} title={d.lookup} subtitle={d.lookupDetail} active />
    <Arrow d='M 275 212 H 323' marker={marker} />
    <Node x={325} y={180} width={240} title={d.answer} subtitle={d.answerDetail} active />
    <Arrow d='M 445 244 V 295 H 300 V 368' marker={marker} />
    <Node x={65} y={370} width={470} title={d.finish} subtitle={d.finishDetail} />
  </>}</DiagramSvg></DiagramFrame>
}
