import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/harness-runtime.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'harnessRuntimeDiagram', { content })

// 图解持续执行中的状态职责、事件回放或目标判定。
export function HarnessRuntimeDiagram () {
  const { t } = useTranslation('harnessRuntimeDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={450} label={d.caption}>{marker => <>
    <Node x={150} y={10} width={300} title={d.top} subtitle={d.topDetail} />
    <Arrow d='M 300 115 V 76' marker={marker} label='观察事件' x={370} y={101} />
    <Node x={100} y={117} width={400} title={d.middle} subtitle={d.middleDetail} active />
    <Arrow d='M 210 181 V 211 H 145 V 238' marker={marker} />
    <Arrow d='M 390 181 V 211 H 455 V 238' marker={marker} />
    <Node x={10} y={240} width={270} title={d.left} subtitle={d.leftDetail} />
    <Node x={320} y={240} width={270} title={d.right} subtitle={d.rightDetail} />
    <Node x={70} y={366} width={460} title={d.bottom} subtitle={d.bottomDetail} dashed />
    <text x='300' y='343' textAnchor='middle' fontSize='13' fill='#57534e'>执行接上之后，仍要核对业务结果</text>
  </>}</DiagramSvg></DiagramFrame>
}
