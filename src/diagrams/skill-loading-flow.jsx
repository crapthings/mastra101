import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/skill-loading-flow.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'skillLoadingFlowDiagram', { content })

// 用图示说明先发现方法，再按需读取。
export function SkillLoadingFlowDiagram () {
  const { t } = useTranslation('skillLoadingFlowDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={435} label={d.caption}>{marker => <>
    <Node x={65} y={10} width={470} title={d.metadata} subtitle={d.metadataDetail} />
    <Arrow d='M 300 74 V 118' marker={marker} />
    <Node x={65} y={120} width={470} title={d.load} subtitle={d.loadDetail} active />
    <Arrow d='M 300 184 V 228' marker={marker} />
    <Node x={65} y={230} width={470} title={d.read} subtitle={d.readDetail} dashed />
    <Arrow d='M 300 294 V 338' marker={marker} />
    <Node x={65} y={340} width={470} title={d.review} subtitle={d.reviewDetail} active />
  </>}</DiagramSvg></DiagramFrame>
}
