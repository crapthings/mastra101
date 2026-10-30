import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/server-stream-events.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'serverStreamEventsDiagram', { content })

// 图解 HTTP 请求路径、流式事件或取消信号的传递。
export function ServerStreamEventsDiagram () {
  const { t } = useTranslation('serverStreamEventsDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={370} label={d.caption}>{marker => <>
    <Node x={70} y={10} width={460} title={d.one} subtitle={d.oneDetail} />
    <Arrow d='M 240 74 V 100 H 145 V 138' marker={marker} />
    <Arrow d='M 280 172 H 318' marker={marker} />
    <Node x={10} y={140} width={270} title={d.left} subtitle={d.leftDetail} active />
    <Node x={320} y={140} width={270} title={d.right} subtitle={d.rightDetail} />
    <Arrow d='M 145 204 V 240 H 300 V 278' marker={marker} />
    <Node x={70} y={280} width={460} title={d.bottom} subtitle={d.bottomDetail} />
  </>}</DiagramSvg></DiagramFrame>
}
