import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/world-prediction.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'worldPredictionDiagram', { content })

// 展示当前状态与动作共同用于预测，不将模型结果视为真实环境的保证。
export function WorldPredictionDiagram () {
  const { t } = useTranslation('worldPredictionDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={575} label={d.caption}>{marker => <>
    <rect x='45' y='10' width='490' height='245' rx='14' fill='none' stroke='#a8a29e' />
    <text x='300' y='40' textAnchor='middle' fontSize='14' fontWeight='600' fill='#57534e'>{d.input}</text>
    <Node x={85} y={65} width={430} title={d.state} subtitle={d.stateDetail} />
    <Node x={85} y={155} width={430} title={d.action} subtitle={d.actionDetail} />
    <Arrow d='M 300 255 V 313' marker={marker} />
    <Node x={85} y={315} width={430} title={d.model} subtitle={d.modelDetail} active />
    <Arrow d='M 300 379 V 443' marker={marker} />
    <Node x={85} y={445} width={430} title={d.prediction} subtitle={d.predictionDetail} />
    <Arrow d='M 515 477 H 575 V 40 H 537' marker={marker} />
    <text x='300' y='552' textAnchor='middle' fontSize='14' fill='#57534e'>{d.continuation}</text>
  </>}</DiagramSvg></DiagramFrame>
}
