import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/document-input.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'documentInputDiagram', { content })

// 用图示说明文档可以经不同路径进入模型，不执行实际模型处理。
export function DocumentInputDiagram () {
  const { t } = useTranslation('documentInputDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={510} label={d.caption}>{marker => <>

    <Node x={60} y={10} width={480} title={d.file} subtitle={d.fileDetail} />
    <Arrow d='M 300 74 V 123' marker={marker} />
    <Node x={60} y={125} width={480} title={d.process} subtitle={d.processDetail} />
    <Arrow d='M 210 189 V 228 H 155 V 268' marker={marker} />
    <Arrow d='M 390 189 V 228 H 445 V 268' marker={marker} />
    <Node x={25} y={270} width={260} title={d.text} subtitle={d.textDetail} />
    <Node x={315} y={270} width={260} title={d.visual} subtitle={d.visualDetail} />
    <Arrow d='M 155 334 V 373 H 240 V 413' marker={marker} />
    <Arrow d='M 445 334 V 373 H 360 V 413' marker={marker} />
    <Node x={60} y={415} width={480} title={d.input} subtitle={d.inputDetail} active />
  </>}</DiagramSvg></DiagramFrame>
}
