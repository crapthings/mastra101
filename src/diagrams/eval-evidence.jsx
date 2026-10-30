import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/eval-evidence.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'evalEvidenceDiagram', { content })

// 图解评估依据、评分阶段或固定条件下的版本比较。
export function EvalEvidenceDiagram () {
  const { t } = useTranslation('evalEvidenceDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={350} label={d.caption}>{marker => <>
    <Node x={10} y={10} width={270} title={d.left} subtitle={d.leftDetail} />
    <Node x={320} y={10} width={270} title={d.right} subtitle={d.rightDetail} />
    <Arrow d='M 145 74 V 100 H 240 V 138' marker={marker} />
    <Arrow d='M 455 74 V 100 H 360 V 138' marker={marker} />
    <Node x={70} y={140} width={460} title={d.middle} subtitle={d.middleDetail} active />
    <Arrow d='M 300 204 V 258' marker={marker} />
    <Node x={70} y={260} width={460} title={d.bottom} subtitle={d.bottomDetail} />
  </>}</DiagramSvg></DiagramFrame>
}
