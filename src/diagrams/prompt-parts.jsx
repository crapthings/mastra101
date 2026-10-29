import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/prompt-parts.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'promptPartsDiagram', { content })

// 将系统与用户提示词按顺序放入同一组输入，说明它们参与同一次调用。
export function PromptPartsDiagram () {
  const { t } = useTranslation('promptPartsDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={530} label={d.caption}>{marker => <>
    <rect x='45' y='10' width='510' height='245' rx='14' fill='none' stroke='#a8a29e' />
    <text x='300' y='40' textAnchor='middle' fontSize='14' fontWeight='600' fill='#57534e'>{d.group}</text>
    <text x='75' y='103' textAnchor='middle' fontSize='14' fill='#78716c'>1</text>
    <Node x={105} y={65} width={400} title={d.system} subtitle={d.systemDetail} />
    <text x='75' y='193' textAnchor='middle' fontSize='14' fill='#78716c'>2</text>
    <Node x={105} y={155} width={400} title={d.user} subtitle={d.userDetail} />
    <Arrow d='M 300 255 V 313' marker={marker} label={d.submit} x={375} y={290} />
    <Node x={105} y={315} width={400} title={d.call} subtitle={d.callDetail} active />
    <Arrow d='M 300 379 V 443' marker={marker} />
    <Node x={105} y={445} width={400} title={d.answer} subtitle={d.answerDetail} />
  </>}</DiagramSvg></DiagramFrame>
}
