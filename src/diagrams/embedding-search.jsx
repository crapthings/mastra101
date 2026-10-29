import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/embedding-search.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'embeddingSearchDiagram', { content })

// 展示嵌入检索候选后，原始查询与候选内容共同参与重排的流程。
export function EmbeddingSearchDiagram () {
  const { t } = useTranslation('embeddingSearchDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={680} label={d.caption}>{marker => <>
    <Node x={20} y={10} width={260} title={d.materials} subtitle={d.materialsDetail} />
    <Node x={320} y={10} width={260} title={d.query} subtitle={d.queryDetail} />
    <Arrow d='M 150 74 V 123' marker={marker} />
    <Arrow d='M 450 74 V 123' marker={marker} />
    <Node x={20} y={125} width={260} title={d.documents} subtitle={d.documentsDetail} />
    <Node x={320} y={125} width={260} title={d.queryVector} subtitle={d.queryVectorDetail} />
    <Arrow d='M 150 189 V 220 H 230 V 258' marker={marker} />
    <Arrow d='M 450 189 V 220 H 370 V 258' marker={marker} />
    <Node x={90} y={260} width={420} title={d.compare} subtitle={d.compareDetail} active />
    <Arrow d='M 300 324 V 373' marker={marker} />
    <Node x={90} y={375} width={420} title={d.results} subtitle={d.resultsDetail} />
    <Arrow d='M 300 439 V 488' marker={marker} />
    <Arrow d='M 580 42 H 590 V 522 H 512' marker={marker} />
    <Node x={90} y={490} width={420} title={d.rerank} subtitle={d.rerankDetail} active />
    <Arrow d='M 300 554 V 603' marker={marker} />
    <Node x={90} y={605} width={420} title={d.selected} subtitle={d.selectedDetail} />
  </>}</DiagramSvg></DiagramFrame>
}
