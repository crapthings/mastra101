import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/harness-coordination.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'harnessCoordinationDiagram', { content })

// 图解连续会话、外部事件或跨进程协调的职责。
export function HarnessCoordinationDiagram () {
  const { t } = useTranslation('harnessCoordinationDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={455} label={d.caption}>{marker => <>
    <Node x={20} y={10} width={270} title={d.left} subtitle={d.leftDetail} active />
    <Node x={310} y={10} width={270} title={d.right} subtitle={d.rightDetail} />
    <Arrow d='M 445 74 V 110 H 370 V 145' marker={marker} />
    <Arrow d='M 230 145 V 110 H 155 V 76' marker={marker} />
    <Node x={70} y={147} width={460} title={d.bus} subtitle={d.busDetail} />
    <Node x={20} y={282} width={270} title={d.lease} subtitle={d.leaseDetail} active />
    <Node x={310} y={282} width={270} title={d.storage} subtitle={d.storageDetail} />
    <text x='300' y='250' textAnchor='middle' fontSize='13' fill='#57534e'>所有实例使用兼容的共享配置</text>
    <text x='300' y='410' textAnchor='middle' fontSize='14' fill='#57534e'>{d.foot}</text>
  </>}</DiagramSvg></DiagramFrame>
}
