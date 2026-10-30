import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/server-request-path.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'serverRequestPathDiagram', { content })

// 图解 HTTP 请求路径、流式事件或取消信号的传递。
export function ServerRequestPathDiagram () {
  const { t } = useTranslation('serverRequestPathDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={440} label={d.caption}>{marker => <>
    <Node x={70} y={10} width={460} title={d.one} subtitle={d.oneDetail} />
    <Arrow d='M 300 74 V 112' marker={marker} />
    <Node x={70} y={114} width={460} title={d.two} subtitle={d.twoDetail} />
    <Arrow d='M 300 178 V 216' marker={marker} />
    <Node x={70} y={218} width={460} title={d.three} subtitle={d.threeDetail} active />
    <Arrow d='M 240 282 V 310 H 145 V 348' marker={marker} />
    <Arrow d='M 360 282 V 310 H 455 V 348' marker={marker} />
    <Node x={10} y={350} width={270} title={d.left} subtitle={d.leftDetail} />
    <Node x={320} y={350} width={270} title={d.right} subtitle={d.rightDetail} />
  </>}</DiagramSvg></DiagramFrame>
}
