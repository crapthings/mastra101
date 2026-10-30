import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/connection-request-paths.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'connectionRequestPathsDiagram', { content })

// 用图示说明外部能力的请求路径、审批或任务交接。
export function ConnectionRequestPathsDiagram () {
  const { t } = useTranslation('connectionRequestPathsDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={385} label={d.caption}>{marker => <>
    <Node x={65} y={10} width={470} title={d.agent} subtitle={d.agentDetail} />
    <Arrow d='M 240 74 V 100 H 150 V 138' marker={marker} />
    <Arrow d='M 360 74 V 100 H 450 V 138' marker={marker} />
    <Node x={15} y={140} width={270} title={d.gateway} subtitle={d.gatewayDetail} />
    <Node x={315} y={140} width={270} title={d.client} subtitle={d.clientDetail} active />
    <Arrow d='M 150 204 V 278' marker={marker} />
    <Arrow d='M 450 204 V 278' marker={marker} />
    <Node x={15} y={280} width={270} title={d.model} subtitle={d.modelDetail} />
    <Node x={315} y={280} width={270} title={d.service} subtitle={d.serviceDetail} active />
  </>}</DiagramSvg></DiagramFrame>
}
