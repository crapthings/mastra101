import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/observe-tree.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'observeTreeDiagram', { content })

// 用示意图说明观测数据的流向、执行层级或排查路径。
export function ObserveTreeDiagram () {
  const { t } = useTranslation('observeTreeDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={450} label={d.caption}>{marker => <>
    <Node x={70} y={5} width={460} title={d.one} subtitle={d.oneDetail} active />
    <Arrow d='M 300 69 V 108' marker={marker} />
    <Node x={70} y={110} width={460} title={d.two} subtitle={d.twoDetail} />
    <Arrow d='M 240 174 V 200 H 145 V 228' marker={marker} />
    <Arrow d='M 360 174 V 200 H 455 V 228' marker={marker} />
    <Node x={10} y={230} width={270} title={d.left} subtitle={d.leftDetail} />
    <Node x={320} y={230} width={270} title={d.right} subtitle={d.rightDetail} />
    <Arrow d='M 145 294 V 348' marker={marker} />
    <Node x={10} y={350} width={270} title={d.tool} subtitle={d.toolDetail} active />
  </>}</DiagramSvg></DiagramFrame>
}
