import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/harness-notification.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'harnessNotificationDiagram', { content })

// 图解连续会话、外部事件或跨进程协调的职责。
export function HarnessNotificationDiagram () {
  const { t } = useTranslation('harnessNotificationDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={495} label={d.caption}>{marker => <>
    <Node x={70} y={5} width={460} title={d.top} subtitle={d.topDetail} />
    <Arrow d='M 300 69 V 96' marker={marker} />
    <Node x={70} y={98} width={460} title={d.middle} subtitle={d.middleDetail} />
    <Arrow d='M 300 162 V 189' marker={marker} />
    <Node x={70} y={191} width={460} title={d.inbox} subtitle={d.inboxDetail} active />
    <Arrow d='M 210 255 V 276 H 155 V 297' marker={marker} />
    <Arrow d='M 390 255 V 276 H 445 V 297' marker={marker} />
    <Node x={20} y={299} width={270} title={d.left} subtitle={d.leftDetail} />
    <Node x={310} y={299} width={270} title={d.right} subtitle={d.rightDetail} />
    <Arrow d='M 155 363 V 392 H 230 V 416' marker={marker} />
    <Arrow d='M 445 363 V 392 H 370 V 416' marker={marker} label={d.later} x={455} y={406} />
    <Node x={70} y={418} width={460} title={d.bottom} subtitle={d.bottomDetail} />
  </>}</DiagramSvg></DiagramFrame>
}
