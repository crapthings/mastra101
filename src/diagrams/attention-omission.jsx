import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/attention-omission.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'attentionOmissionDiagram', { content })

// 逐项对照完整输入与有遗漏的示例回答，不推断模型内部的注意力权重。
export function AttentionOmissionDiagram () {
  const { t } = useTranslation('attentionOmissionDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={395} label={d.caption}>{marker => <>
    <text x='142.5' y='28' textAnchor='middle' fontSize='15' fontWeight='600' fill='#292524'>{d.input}</text>
    <text x='457.5' y='28' textAnchor='middle' fontSize='15' fontWeight='600' fill='#292524'>{d.output}</text>
    {d.rows.map((row, index) => <g key={row.title}>
      <Node x={25} y={55 + index * 85} width={235} title={row.title} subtitle={row.input} active={row.missing} />
      <Arrow d={`M 260 ${87 + index * 85} H 338`} marker={marker} />
      <rect x='340' y={55 + index * 85} width='235' height='64' rx='10' fill={row.missing ? '#fef2f2' : '#fafaf9'} stroke={row.missing ? '#dc2626' : '#d6d3d1'} />
      <text x='457.5' y={81 + index * 85} textAnchor='middle' fontSize='16' fontWeight='600' fill={row.missing ? '#991b1b' : '#292524'}>{row.status}</text>
      <text x='457.5' y={103 + index * 85} textAnchor='middle' fontSize='13' fill={row.missing ? '#991b1b' : '#57534e'}>{row.output}</text>
    </g>)}
  </>}</DiagramSvg></DiagramFrame>
}
