import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/subagent-result-flow.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'subagentResultFlowDiagram', { content })

// 用独立图示解释子任务的输入、交接或运行范围。
export function SubagentResultFlowDiagram () {
  const { t } = useTranslation('subagentResultFlowDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={385} label={d.caption}>{marker => <>
    <Node x={65} y={10} width={470} title={d.tool} subtitle={d.toolDetail} />
    <Arrow d='M 300 74 V 118' marker={marker} />
    <Node x={65} y={120} width={470} title={d.result} subtitle={d.resultDetail} active />
    <Arrow d='M 300 184 V 230 H 150 V 278' marker={marker} />
    <Arrow d='M 300 184 V 230 H 450 V 278' marker={marker} />
    <Node x={15} y={280} width={270} title={d.parent} subtitle={d.parentDetail} active />
    <Node x={315} y={280} width={270} title={d.app} subtitle={d.appDetail} />
  </>}</DiagramSvg></DiagramFrame>
}
