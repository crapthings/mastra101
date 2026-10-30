import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/deployment-units.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'deploymentUnitsDiagram', { content })

// 图解权限判断或应用部署与运行中的职责交接。
export function DeploymentUnitsDiagram () {
  const { t } = useTranslation('deploymentUnitsDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={370} label={d.caption}>{marker => <>
    <Node x={70} y={10} width={460} title={d.one} subtitle={d.oneDetail} />
    <Arrow d='M 300 74 V 100 H 455 V 138' marker={marker} />
    <Node x={10} y={140} width={270} title={d.left} subtitle={d.leftDetail} />
    <Arrow d='M 280 172 H 318' marker={marker} />
    <Node x={320} y={140} width={270} title={d.right} subtitle={d.rightDetail} active />
    <Arrow d='M 455 204 V 240 H 300 V 278' marker={marker} />
    <Node x={70} y={280} width={460} title={d.bottom} subtitle={d.bottomDetail} />
  </>}</DiagramSvg></DiagramFrame>
}
