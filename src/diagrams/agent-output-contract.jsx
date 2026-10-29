import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/agent-output-contract.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'agentOutputContractDiagram', { content })

// 沿结果流向区分工具返回结构和 Agent 最终交付结构。
export function AgentOutputContractDiagram () {
  const { t } = useTranslation('agentOutputContractDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={435} label={d.caption}>{marker => <>
    <Node x={70} y={10} width={460} title={d.tool} subtitle={d.toolDetail} />
    <Arrow d='M 300 74 V 118' marker={marker} />
    <Node x={70} y={120} width={460} title={d.toolSchema} subtitle={d.toolSchemaDetail} active />
    <Arrow d='M 300 184 V 228' marker={marker} />
    <Node x={70} y={230} width={460} title={d.model} subtitle={d.modelDetail} />
    <Arrow d='M 300 294 V 348' marker={marker} />
    <Node x={70} y={350} width={460} title={d.final} subtitle={d.finalDetail} active />
  </>}</DiagramSvg></DiagramFrame>
}
