import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/harness-replay.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'harnessReplayDiagram', { content })

// 图解持续执行中的状态职责、事件回放或目标判定。
export function HarnessReplayDiagram () {
  const { t } = useTranslation('harnessReplayDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={425} label={d.caption}>{marker => <>
    <Node x={80} y={10} width={440} title={d.one} subtitle={d.oneDetail} />
    <Arrow d='M 300 74 V 115' marker={marker} />
    <Node x={80} y={117} width={440} title={d.two} subtitle={d.twoDetail} />
    <Arrow d='M 300 181 V 222' marker={marker} />
    <Node x={80} y={224} width={440} title={d.three} subtitle={d.threeDetail} active />
    <Arrow d='M 300 288 V 329' marker={marker} />
    <Node x={80} y={331} width={440} title={d.four} subtitle={d.fourDetail} />
  </>}</DiagramSvg></DiagramFrame>
}
