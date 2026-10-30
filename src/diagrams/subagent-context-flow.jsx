import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/subagent-context-flow.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'subagentContextFlowDiagram', { content })

// 用独立图示解释子任务的输入、交接或运行范围。
export function SubagentContextFlowDiagram () {
  const { t } = useTranslation('subagentContextFlowDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={385} label={d.caption}>{marker => <>
    <Node x={15} y={10} width={270} title={d.history} subtitle={d.historyDetail} />
    <Node x={315} y={10} width={270} title={d.prompt} subtitle={d.promptDetail} />
    <Arrow d='M 150 74 V 118' marker={marker} />
    <Arrow d='M 450 74 V 118' marker={marker} />
    <Node x={15} y={120} width={270} title={d.filter} subtitle={d.filterDetail} active />
    <Node x={315} y={120} width={270} title={d.rewrite} subtitle={d.rewriteDetail} active />
    <Arrow d='M 150 184 V 230 H 240 V 278' marker={marker} />
    <Arrow d='M 450 184 V 230 H 360 V 278' marker={marker} />
    <Node x={65} y={280} width={470} title={d.child} subtitle={d.childDetail} />
  </>}</DiagramSvg></DiagramFrame>
}
