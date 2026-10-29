import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/prompt-comparison.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'promptComparisonDiagram', { content })

// 用关系图说明每组比较，只改变要研究的部分，不发起实际模型请求。
export function PromptComparisonDiagram () {
  const { t } = useTranslation('promptComparisonDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={480} label={d.caption}>{marker => <>

    <text x='160' y='30' textAnchor='middle' fontSize='16' fontWeight='600' fill='#292524'>{d.left}</text>
    <text x='440' y='30' textAnchor='middle' fontSize='16' fontWeight='600' fill='#292524'>{d.right}</text>
    <Node x={30} y={55} width={260} title={d.systemChanged} active />
    <Node x={310} y={55} width={260} title={d.systemFixed} />
    <Node x={30} y={135} width={260} title={d.userFixed} subtitle={d.leftNote} />
    <Node x={310} y={135} width={260} title={d.userChanged} subtitle={d.rightNote} active />
    <Arrow d='M 160 199 V 235 H 240 V 268' marker={marker} />
    <Arrow d='M 440 199 V 235 H 360 V 268' marker={marker} />
    <Node x={90} y={270} width={420} title={d.common} subtitle={d.commonDetail} />
    <Arrow d='M 300 334 V 388' marker={marker} />
    <Node x={90} y={390} width={420} title={d.judge} subtitle={d.judgeDetail} />
  </>}</DiagramSvg></DiagramFrame>
}
