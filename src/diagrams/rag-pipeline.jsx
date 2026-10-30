import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/rag-pipeline.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'ragPipelineDiagram', { content })

// 图解文档入库、范围检索或回答引用的职责。
export function RagPipelineDiagram () {
  const { t } = useTranslation('ragPipelineDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={440} label={d.caption}>{marker => <>
    <Node x={10} y={10} width={270} title={d.left} subtitle={d.leftDetail} />
    <Node x={320} y={10} width={270} title={d.right} subtitle={d.rightDetail} />
    <Arrow d='M 145 74 V 112' marker={marker} />
    <Arrow d='M 455 74 V 112' marker={marker} />
    <Node x={10} y={114} width={270} title={d.leftTwo} subtitle={d.leftTwoDetail} />
    <Node x={320} y={114} width={270} title={d.rightTwo} subtitle={d.rightTwoDetail} />
    <Arrow d='M 145 178 V 206 H 240 V 240' marker={marker} />
    <Arrow d='M 455 178 V 206 H 360 V 240' marker={marker} />
    <Node x={70} y={242} width={460} title={d.middle} subtitle={d.middleDetail} active />
    <Arrow d='M 300 306 V 348' marker={marker} />
    <Node x={70} y={350} width={460} title={d.bottom} subtitle={d.bottomDetail} />
  </>}</DiagramSvg></DiagramFrame>
}
