import { useTranslation } from 'react-i18next'
import { DiagramFrame, DiagramSvg, Arrow } from './frame'

// Trace tool requests and results across model, application, and external-service lanes.
export function ToolsDiagram () {
  const { t } = useTranslation()
  const d = t('diagrams.tools', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={350} label={d.caption}>{marker => <>
    {d.lanes.map((lane, index) => <g key={lane}><text x={85 + index * 215} y='30' textAnchor='middle' fontSize='16' fill='#292524'>{lane}</text><path d={`M ${85 + index * 215} 50 V 330`} stroke='#d6d3d1' strokeDasharray='4 5' /></g>)}
    <Arrow d='M 85 100 H 298' marker={marker} label={d.request} x={190} y={85} />
    <Arrow d='M 300 165 H 513' marker={marker} label={d.execute} x={408} y={150} />
    <Arrow d='M 515 230 H 302' marker={marker} label={d.result} x={408} y={215} />
    <Arrow d='M 300 295 H 87' marker={marker} label={d.return} x={190} y={280} />
  </>}</DiagramSvg></DiagramFrame>
}
