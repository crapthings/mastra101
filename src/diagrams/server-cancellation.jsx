import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/server-cancellation.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'serverCancellationDiagram', { content })

// 图解 HTTP 请求路径、流式事件或取消信号的传递。
export function ServerCancellationDiagram () {
  const { t } = useTranslation('serverCancellationDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={425} label={d.caption}>{marker => <>
    <Node x={70} y={10} width={460} title={d.one} subtitle={d.oneDetail} />
    <Arrow d='M 300 74 V 116' marker={marker} />
    <Node x={70} y={118} width={460} title={d.two} subtitle={d.twoDetail} />
    <Arrow d='M 300 182 V 224' marker={marker} />
    <Node x={70} y={226} width={460} title={d.three} subtitle={d.threeDetail} active />
    <Arrow d='M 300 290 V 332' marker={marker} />
    <Node x={70} y={334} width={460} title={d.four} subtitle={d.fourDetail} />
  </>}</DiagramSvg></DiagramFrame>
}
