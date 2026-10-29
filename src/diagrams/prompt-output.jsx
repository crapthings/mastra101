import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/prompt-output.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'promptOutputDiagram', { content })

// 用关系图说明输出需要过三层检查，不发起实际模型请求。
export function PromptOutputDiagram () {
  const { t } = useTranslation('promptOutputDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={460} label={d.caption}>{marker => <>

    <Node x={90} y={10} width={420} title={d.parse} subtitle={d.parseDetail} />
    <Arrow d='M 300 74 V 143' marker={marker} />
    <text x='440' y='115' textAnchor='middle' fontSize='13' fill='#57534e'>{d.parseNote}</text>
    <Node x={90} y={145} width={420} title={d.shape} subtitle={d.shapeDetail} />
    <Arrow d='M 300 209 V 278' marker={marker} />
    <text x='440' y='250' textAnchor='middle' fontSize='13' fill='#57534e'>{d.shapeNote}</text>
    <Node x={90} y={280} width={420} title={d.facts} subtitle={d.factsDetail} active />
    <text x='300' y='411' textAnchor='middle' fontSize='14' fill='#57534e'>{d.finish}</text>
  </>}</DiagramSvg></DiagramFrame>
}
