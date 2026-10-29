import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/harness.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'harnessDiagram', { content })

// Place the model inside its runtime support to distinguish generation from application work.
export function HarnessDiagram () {
  const { t } = useTranslation('harnessDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={490} label={d.caption}>{marker => <>
    <rect x='15' y='15' width='570' height='455' rx='16' fill='none' stroke='#a8a29e' strokeDasharray='5 5' />
    <text x='300' y='45' textAnchor='middle' fontSize='16' fontWeight='600' fill='#292524'>{d.boundary}</text>
    <Node x={190} y={70} width={220} title={d.input} subtitle={d.sources} />
    <Node x={190} y={195} width={220} title={d.model} subtitle={d.generate} active />
    <Node x={190} y={320} width={220} title={d.execute} subtitle={d.check} />
    <Arrow d='M 300 134 V 193' marker={marker} label={d.messages} x={350} y={168} />
    <Arrow d='M 300 259 V 318' marker={marker} label={d.request} x={350} y={294} />
    <Arrow d='M 410 352 H 520 V 102 H 412' marker={marker} label={d.feedback} x={464} y={235} />
    <text x='300' y='430' textAnchor='middle' fontSize='15' fill='#57534e'>{d.progress}</text>
  </>}</DiagramSvg></DiagramFrame>
}
