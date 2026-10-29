import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/agent-processor-stages.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'agentProcessorStagesDiagram', { content })

// 沿运行路径标出处理器的介入时机与流式分片处理位置。
export function AgentProcessorStagesDiagram () {
  const { t } = useTranslation('agentProcessorStagesDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={675} label={d.caption}>{marker => <>
    <Node x={55} y={10} width={290} title={d.input} subtitle={d.inputDetail} />
    <Arrow d='M 200 74 V 118' marker={marker} />
    <Node x={55} y={120} width={290} title={d.before} subtitle={d.beforeDetail} active />
    <Arrow d='M 200 184 V 218' marker={marker} />
    <Node x={55} y={220} width={290} title={d.model} />
    <Arrow d='M 345 252 H 378' marker={marker} />
    <Node x={380} y={220} width={210} title={d.stream} subtitle={d.streamDetail} />
    <Arrow d='M 200 284 V 318' marker={marker} />
    <Node x={55} y={320} width={290} title={d.after} subtitle={d.afterDetail} active />
    <Arrow d='M 200 384 V 418' marker={marker} />
    <Node x={55} y={420} width={290} title={d.tool} subtitle={d.toolDetail} />
    <Arrow d='M 55 452 H 20 V 152 H 53' marker={marker} />
    <text x='60' y='520' fontSize='13' fill='#57534e'>{d.again}</text>
    <path d='M 20 452 V 516 H 50' fill='none' stroke='#a8a29e' strokeDasharray='4 4' />
    <Arrow d='M 200 484 V 578' marker={marker} label={d.done} x={250} y={545} />
    <Node x={55} y={580} width={290} title={d.final} subtitle={d.finalDetail} />
  </>}</DiagramSvg></DiagramFrame>
}
