import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/provider-path.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'providerPathDiagram', { content })

// Trace only the configured Vercel route and distinguish local SDK work from remote services.
export function ProviderPathDiagram () {
  const { t } = useTranslation('providerPathDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={470} label={d.caption}>{marker => <>
    <rect x='25' y='10' width='550' height='165' rx='14' fill='none' stroke='#a8a29e' strokeDasharray='5 5' />
    <text x='300' y='38' textAnchor='middle' fontSize='14' fill='#57534e'>{d.local}</text>
    <Node x={65} y={65} width={470} title={d.agent} subtitle={d.identifier} />
    <text x='300' y='155' textAnchor='middle' fontSize='13' fill='#57534e'>{d.sdk}</text>
    <Node x={125} y={245} width={350} title={d.gateway} subtitle={d.key} />
    <Arrow d='M 245 175 V 243' marker={marker} label={d.request} x={170} y={215} />
    <Arrow d='M 355 245 V 177' marker={marker} label={d.response} x={420} y={215} />
    <Node x={125} y={390} width={350} title={d.upstream} subtitle={d.model} />
    <Arrow d='M 245 309 V 388' marker={marker} label={d.forward} x={165} y={352} />
    <Arrow d='M 355 390 V 311' marker={marker} label={d.generated} x={425} y={352} />
  </>}</DiagramSvg></DiagramFrame>
}
