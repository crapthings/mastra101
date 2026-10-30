import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/memory-semantic-flow.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'memorySemanticFlowDiagram', { content })

// 用图示说明保存时建索引，提问时找候选。
export function MemorySemanticFlowDiagram () {
  const { t } = useTranslation('memorySemanticFlowDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={440} label={d.caption}>{marker => <>
    <text x='15' y='28' fontSize='15' fontWeight='600' fill='#57534e'>{d.save}</text>
    <Node x={15} y={50} width={170} title={d.old} subtitle={d.oldDetail} />
    <Arrow d='M 185 82 H 213' marker={marker} />
    <Node x={215} y={50} width={170} title={d.embed} subtitle={d.embedDetail} />
    <Arrow d='M 385 82 H 413' marker={marker} />
    <Node x={415} y={50} width={170} title={d.index} subtitle={d.indexDetail} active />
    <text x='15' y='190' fontSize='15' fontWeight='600' fill='#57534e'>{d.query}</text>
    <Node x={15} y={210} width={170} title={d.question} subtitle={d.questionDetail} />
    <Arrow d='M 185 242 H 213' marker={marker} />
    <Node x={215} y={210} width={170} title={d.queryEmbed} subtitle={d.queryEmbedDetail} />
    <Arrow d='M 385 242 H 413' marker={marker} />
    <Node x={415} y={210} width={170} title={d.search} subtitle={d.searchDetail} active />
    <Arrow d='M 500 114 V 208' marker={marker} />
    <Arrow d='M 500 274 V 312 H 300 V 348' marker={marker} />
    <Node x={60} y={350} width={480} title={d.result} subtitle={d.resultDetail} active />
  </>}</DiagramSvg></DiagramFrame>
}
