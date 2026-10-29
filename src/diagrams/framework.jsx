import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/framework.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'frameworkDiagram', { content })

// Separate business decisions, reusable mechanisms, and external services without implying automatic integration.
export function FrameworkDiagram () {
  const { t } = useTranslation('frameworkDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={470} label={d.caption}>{marker => <>
    <Node x={50} y={20} width={500} title={d.business} subtitle={d.rules} />
    <Arrow d='M 300 84 V 145' marker={marker} label={d.configure} x={378} y={121} />
    <rect x='25' y='147' width='550' height='145' rx='12' fill='#fafaf9' stroke='#d6d3d1' />
    <text x='300' y='178' textAnchor='middle' fontSize='16' fontWeight='600' fill='#292524'>{d.mechanisms}</text>
    {d.parts.map((part, index) => <Node key={part} x={45 + index * 175} y={199} width={160} title={part} />)}
    <Arrow d='M 300 292 V 355' marker={marker} label={d.connect} x={365} y={330} />
    <Node x={50} y={357} width={500} title={d.services} subtitle={d.serviceExamples} dashed />
    <text x='300' y='453' textAnchor='middle' fontSize='13' fill='#57534e'>{d.harness}</text>
  </>}</DiagramSvg></DiagramFrame>
}
