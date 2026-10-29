import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/agent-retry-layers.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'agentRetryLayersDiagram', { content })

// 区分请求重试、处理器反馈与外部业务恢复的范围。
export function AgentRetryLayersDiagram () {
  const { t } = useTranslation('agentRetryLayersDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={560} label={d.caption}>{marker => <>
    <Node x={30} y={20} width={230} title={d.request} subtitle={d.requestDetail} />
    <Arrow d='M 260 52 H 338' marker={marker} />
    <Node x={340} y={20} width={230} title={d.requestError} subtitle={d.requestErrorDetail} />
    <Arrow d='M 455 84 V 125 H 145 V 86' marker={marker} />
    <text x='300' y='153' textAnchor='middle' fontSize='14' fill='#57534e'>{d.requestRetry}</text>
    <path d='M 30 178 H 570' stroke='#e7e5e4' />
    <Node x={30} y={205} width={230} title={d.step} subtitle={d.stepDetail} />
    <Arrow d='M 260 237 H 338' marker={marker} />
    <Node x={340} y={205} width={230} title={d.rejected} subtitle={d.rejectedDetail} />
    <Arrow d='M 455 269 V 310 H 145 V 271' marker={marker} />
    <text x='300' y='338' textAnchor='middle' fontSize='14' fill='#57534e'>{d.feedback}</text>
    <path d='M 30 363 H 570' stroke='#e7e5e4' />
    <Node x={30} y={390} width={230} title={d.write} subtitle={d.writeDetail} />
    <Arrow d='M 260 422 H 338' marker={marker} />
    <Node x={340} y={390} width={230} title={d.verify} subtitle={d.verifyDetail} active />
    <text x='300' y='505' textAnchor='middle' fontSize='14' fill='#57534e'>{d.business}</text>
  </>}</DiagramSvg></DiagramFrame>
}
