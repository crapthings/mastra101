import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/prompt-tone.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'promptToneDiagram', { content })

// 用关系图说明表达可以改变，信息依据保持不变，不发起实际模型请求。
export function PromptToneDiagram () {
  const { t } = useTranslation('promptToneDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={425} label={d.caption}>{marker => <>

    <Node x={80} y={10} width={440} title={d.facts} subtitle={d.factsDetail} />
    <Arrow d='M 220 74 V 115 H 160 V 178' marker={marker} />
    <Arrow d='M 380 74 V 115 H 440 V 178' marker={marker} />
    <text x='90' y='145' textAnchor='middle' fontSize='14' fill='#57534e'>{d.audienceA}</text>
    <text x='510' y='145' textAnchor='middle' fontSize='14' fill='#57534e'>{d.audienceB}</text>
    <Node x={30} y={180} width={260} title={d.formal} subtitle={d.formalDetail} />
    <Node x={310} y={180} width={260} title={d.friendly} subtitle={d.friendlyDetail} />
    <Arrow d='M 160 244 V 285 H 240 V 328' marker={marker} />
    <Arrow d='M 440 244 V 285 H 360 V 328' marker={marker} />
    <Node x={80} y={330} width={440} title={d.check} subtitle={d.checkDetail} active />
  </>}</DiagramSvg></DiagramFrame>
}
