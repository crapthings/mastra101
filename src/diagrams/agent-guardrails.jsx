import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/agent-guardrails.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'agentGuardrailsDiagram', { content })

// 区分检查通过、检测违规与检测器失败，避免把未检查视为通过。
export function AgentGuardrailsDiagram () {
  const { t } = useTranslation('agentGuardrailsDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={380} label={d.caption}>{marker => <>
    <Node x={100} y={10} width={400} title={d.input} />
    <Arrow d='M 300 74 V 108' marker={marker} />
    <Node x={100} y={110} width={400} title={d.check} subtitle={d.checkDetail} active />
    <Arrow d='M 300 174 V 205 H 100 V 248' marker={marker} />
    <Arrow d='M 300 174 V 248' marker={marker} />
    <Arrow d='M 300 174 V 205 H 500 V 248' marker={marker} />
    <Node x={10} y={250} width={180} title={d.pass} subtitle={d.passDetail} />
    <Node x={210} y={250} width={180} title={d.flag} subtitle={d.flagDetail} />
    <Node x={410} y={250} width={180} title={d.failure} subtitle={d.failureDetail} />
    <text x='100' y='350' textAnchor='middle' fontSize='13' fill='#57534e'>{d.passResult}</text>
    <text x='300' y='350' textAnchor='middle' fontSize='13' fill='#57534e'>{d.flagResult}</text>
    <text x='500' y='350' textAnchor='middle' fontSize='13' fill='#57534e'>{d.failureResult}</text>
  </>}</DiagramSvg></DiagramFrame>
}
