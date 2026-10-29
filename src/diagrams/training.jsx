import { useTranslation } from 'react-i18next'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

// Compare parameter updates during training with reading weights during ordinary inference.
export function TrainingDiagram () {
  const { t } = useTranslation()
  const d = t('diagrams.training', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={350} label={d.caption}>{marker => <>
    <text x='145' y='25' textAnchor='middle' fontSize='16' fill='#292524'>{d.train}</text>
    <text x='455' y='25' textAnchor='middle' fontSize='16' fill='#292524'>{d.inference}</text>
    <path d='M 300 10 V 340' stroke='#e7e5e4' strokeDasharray='4 5' />
    <Node x={55} y={45} title={d.data} /><Node x={55} y={155} title={d.compare} /><Node x={55} y={265} title={d.update} />
    <Arrow d='M 145 109 V 153' marker={marker} /><Arrow d='M 145 219 V 263' marker={marker} />
    <Arrow d='M 55 297 H 20 V 185 H 53' marker={marker} />
    <Node x={365} y={45} title={d.weights} /><Node x={365} y={155} title={d.calculate} subtitle={d.input} /><Node x={365} y={265} title={d.result} />
    <Arrow d='M 455 109 V 153' marker={marker} label={d.read} x={494} y={135} /><Arrow d='M 455 219 V 263' marker={marker} />
  </>}</DiagramSvg></DiagramFrame>
}
