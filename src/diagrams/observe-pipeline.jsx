import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/observe-pipeline.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'observePipelineDiagram', { content })

// 用示意图说明观测数据的流向、执行层级或排查路径。
export function ObservePipelineDiagram () {
  const { t } = useTranslation('observePipelineDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={355} label={d.caption}>{marker => <>
    <Node x={70} y={10} width={460} title={d.one} subtitle={d.oneDetail} />
    <Arrow d='M 70 42 H 25 V 232 H 150 V 260' marker={marker} />
    <Arrow d='M 300 74 V 120' marker={marker} />
    <Node x={70} y={122} width={460} title={d.two} subtitle={d.twoDetail} active />
    <Arrow d='M 300 186 V 220 H 450 V 260' marker={marker} />
    <Node x={10} y={262} width={280} title={d.left} subtitle={d.leftDetail} />
    <Node x={310} y={262} width={280} title={d.right} subtitle={d.rightDetail} active />
  </>}</DiagramSvg></DiagramFrame>
}
