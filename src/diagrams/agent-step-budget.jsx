import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/agent-step-budget.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'agentStepBudgetDiagram', { content })

// 展示模型步骤与工具执行的归属，以及 maxSteps 截止的位置。
export function AgentStepBudgetDiagram () {
  const { t } = useTranslation('agentStepBudgetDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={510} label={d.caption}>{marker => <>
    <rect x='35' y='10' width='530' height='230' rx='14' fill='#fafaf9' stroke='#d6d3d1' />
    <text x='60' y='40' fontSize='15' fontWeight='600' fill='#57534e'>{d.first}</text>
    <Node x={100} y={55} width={400} title={d.request} subtitle={d.requestDetail} active />
    <Arrow d='M 300 119 V 153' marker={marker} />
    <Node x={100} y={155} width={400} title={d.tool} subtitle={d.toolDetail} />
    <path d='M 35 265 H 565' stroke='#a8a29e' strokeDasharray='5 5' />
    <rect x='170' y='252' width='260' height='26' rx='6' fill='#f5f5f4' />
    <text x='300' y='270' textAnchor='middle' fontSize='14' fill='#44403c'>{d.limit}</text>
    <Arrow d='M 300 280 V 355' marker={marker} label={d.continue} x={432} y={320} />
    <rect x='35' y='360' width='530' height='130' rx='14' fill='#eff6ff' stroke='#93c5fd' />
    <text x='60' y='390' fontSize='15' fontWeight='600' fill='#57534e'>{d.second}</text>
    <Node x={100} y={405} width={400} title={d.answer} subtitle={d.answerDetail} active />
  </>}</DiagramSvg></DiagramFrame>
}
