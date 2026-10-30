import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/harness-goal.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'harnessGoalDiagram', { content })

// 图解持续执行中的状态职责、事件回放或目标判定。
export function HarnessGoalDiagram () {
  const { t } = useTranslation('harnessGoalDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={480} label={d.caption}>{marker => <>
    <Node x={100} y={10} width={400} title={d.one} subtitle={d.oneDetail} />
    <Arrow d='M 300 74 V 114' marker={marker} />
    <Node x={100} y={116} width={400} title={d.two} subtitle={d.twoDetail} />
    <Arrow d='M 300 180 V 220' marker={marker} />
    <Node x={100} y={222} width={400} title={d.three} subtitle={d.threeDetail} active />
    <Arrow d='M 200 286 V 323 H 100 V 356' marker={marker} />
    <Arrow d='M 300 286 V 356' marker={marker} />
    <Arrow d='M 400 286 V 323 H 500 V 356' marker={marker} />
    <Node x={15} y={358} width={170} title={d.left} subtitle={d.leftDetail} />
    <Node x={215} y={358} width={170} title={d.middle} subtitle={d.middleDetail} />
    <Node x={415} y={358} width={170} title={d.right} subtitle={d.rightDetail} />
    <Arrow d='M 100 422 V 458 H 2 V 148 H 98' marker={marker} />
    <text x='116' y='456' fontSize='13' fill='#57534e'>{d.loop}</text>
  </>}</DiagramSvg></DiagramFrame>
}
