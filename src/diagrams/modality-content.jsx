import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/modality-content.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'modalityContentDiagram', { content })

// 用图示说明模型处理的是实际提供的内容，不执行实际模型处理。
export function ModalityContentDiagram () {
  const { t } = useTranslation('modalityContentDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={470} label={d.caption}>{marker => <>

    <Node x={70} y={10} width={460} title={d.materials} subtitle={d.materialsDetail} />
    <Arrow d='M 300 74 V 133' marker={marker} />
    <Node x={70} y={135} width={460} title={d.prepare} subtitle={d.prepareDetail} />
    <Arrow d='M 300 199 V 258' marker={marker} />
    <Node x={70} y={260} width={460} title={d.content} subtitle={d.contentDetail} active />
    <Arrow d='M 300 324 V 383' marker={marker} />
    <Node x={70} y={385} width={460} title={d.model} subtitle={d.modelDetail} />
  </>}</DiagramSvg></DiagramFrame>
}
