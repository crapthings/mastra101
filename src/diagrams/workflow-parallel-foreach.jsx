import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/workflow-parallel-foreach.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'workflowParallelForeachDiagram', { content })

// 用图示说明不同工作一起做，同一工作逐项做。
export function WorkflowParallelForeachDiagram () {
  const { t } = useTranslation('workflowParallelForeachDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={650} label={d.caption}>{marker => <>
    <Node x={100} y={10} width={400} title={d.input} />
    <Arrow d='M 300 74 V 100 H 155 V 128' marker={marker} />
    <Arrow d='M 300 74 V 100 H 445 V 128' marker={marker} />
    <Node x={20} y={130} width={270} title={d.entrance} />
    <Node x={310} y={130} width={270} title={d.materials} />
    <Arrow d='M 155 194 V 220 H 300 V 248' marker={marker} />
    <Arrow d='M 445 194 V 220 H 300 V 248' marker={marker} />
    <Node x={65} y={250} width={470} title={d.merge} subtitle={d.mergeDetail} active />
    <Arrow d='M 300 314 V 335 H 100 V 398' marker={marker} />
    <Arrow d='M 300 314 V 345 H 300 V 398' marker={marker} />
    <Arrow d='M 300 314 V 335 H 500 V 398' marker={marker} />
    <rect x='180' y='350' width='240' height='28' fill='white' />
    <text x='300' y='369' textAnchor='middle' fontSize='14' fontWeight='600' fill='#57534e'>{d.foreach}</text>
    <Node x={15} y={400} width={170} title={d.one} subtitle={d.same} active />
    <Node x={215} y={400} width={170} title={d.two} subtitle={d.same} active />
    <Node x={415} y={400} width={170} title={d.three} subtitle={d.queued} dashed />
    <Arrow d='M 100 464 V 510 H 300 V 548' marker={marker} />
    <Arrow d='M 300 464 V 548' marker={marker} />
    <Arrow d='M 500 464 V 510 H 300 V 548' marker={marker} />
    <Node x={65} y={550} width={470} title={d.result} subtitle={d.resultDetail} active />
  </>}</DiagramSvg></DiagramFrame>
}
