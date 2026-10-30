import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/observe-diagnosis.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'observeDiagnosisDiagram', { content })

// 用示意图说明观测数据的流向、执行层级或排查路径。
export function ObserveDiagnosisDiagram () {
  const { t } = useTranslation('observeDiagnosisDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={435} label={d.caption}>{marker => <>
    <Node x={70} y={10} width={460} title={d.one} subtitle={d.oneDetail} />
    <Arrow d='M 300 74 V 120' marker={marker} />
    <Node x={70} y={122} width={460} title={d.two} subtitle={d.twoDetail} active />
    <Arrow d='M 300 186 V 232' marker={marker} />
    <Node x={70} y={234} width={460} title={d.left} subtitle={d.leftDetail} />
    <Arrow d='M 300 298 V 344' marker={marker} />
    <Node x={70} y={346} width={460} title={d.right} subtitle={d.rightDetail} />
  </>}</DiagramSvg></DiagramFrame>
}
