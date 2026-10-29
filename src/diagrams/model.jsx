import { useTranslation } from 'react-i18next'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

// Show model files as inputs to a running inference program, separate from the application.
export function ModelDiagram () {
  const { t } = useTranslation()
  const d = t('diagrams.model', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={320} label={d.caption}>{marker => <>
    <Node x={30} y={20} width={240} title={d.files} subtitle={d.weights} dashed />
    <Node x={330} y={20} width={240} title={d.structure} subtitle={d.config} dashed />
    <Arrow d='M 150 84 V 110 H 260 V 140' marker={marker} label={d.load} x={150} y={132} />
    <Arrow d='M 450 84 V 110 H 340 V 140' marker={marker} />
    <Node x={210} y={140} title={d.runtime} subtitle={d.compute} />
    <Node x={210} y={250} title={d.app} />
    <Arrow d='M 245 250 V 206' marker={marker} label={d.input} x={193} y={232} />
    <Arrow d='M 355 206 V 248' marker={marker} label={d.output} x={409} y={232} />
  </>}</DiagramSvg></DiagramFrame>
}
