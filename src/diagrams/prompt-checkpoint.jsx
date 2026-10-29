import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/prompt-checkpoint.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'promptCheckpointDiagram', { content })

// 展示分片保存与断点更新的先后关系，以及中断后的重试位置。
export function PromptCheckpointDiagram () {
  const { t } = useTranslation('promptCheckpointDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={570} label={d.caption}>{marker => <>
    <Node x={130} y={10} width={340} title={d.receive} subtitle={d.receiveDetail} />
    <Arrow d='M 300 74 V 103' marker={marker} />
    <Node x={130} y={105} width={340} title={d.check} subtitle={d.checkDetail} />
    <Arrow d='M 300 169 V 198' marker={marker} />
    <Node x={130} y={200} width={340} title={d.save} subtitle={d.saveDetail} />
    <Arrow d='M 300 264 V 293' marker={marker} />
    <Node x={130} y={295} width={340} title={d.checkpoint} subtitle={d.checkpointDetail} active />
    <path d='M 20 389 H 580' stroke='#e7e5e4' />
    <text x='300' y='423' textAnchor='middle' fontSize='15' fill='#292524'>{d.example}</text>
    <Node x={20} y={445} width={170} title={d.first} subtitle={d.saved} />
    <Node x={215} y={445} width={170} title={d.second} subtitle={d.saved} />
    <Node x={410} y={445} width={170} title={d.third} subtitle={d.incomplete} dashed />
    <text x='300' y='548' textAnchor='middle' fontSize='14' fill='#57534e'>{d.resume}</text>
  </>}</DiagramSvg></DiagramFrame>
}
