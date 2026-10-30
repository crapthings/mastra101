import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/harness-thread.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'harnessThreadDiagram', { content })

// 图解连续会话、外部事件或跨进程协调的职责。
export function HarnessThreadDiagram () {
  const { t } = useTranslation('harnessThreadDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={445} label={d.caption}>{marker => <>
    <Node x={90} y={10} width={420} title={d.top} subtitle={d.detail} />
    <Arrow d='M 200 74 V 105 H 150 V 133' marker={marker} />
    <Arrow d='M 400 74 V 105 H 450 V 133' marker={marker} />
    <Node x={15} y={135} width={270} title={d.left} subtitle={d.leftDetail} />
    <Node x={315} y={135} width={270} title={d.right} subtitle={d.rightDetail} />
    <Arrow d='M 150 199 V 230 H 230 V 278' marker={marker} />
    <Arrow d='M 450 199 V 230 H 370 V 278' marker={marker} />
    <Node x={70} y={280} width={460} title={d.bottom} subtitle={d.bottomDetail} active />
    <text x='300' y='395' textAnchor='middle' fontSize='14' fill='#57534e'>{d.foot}</text>
  </>}</DiagramSvg></DiagramFrame>
}
