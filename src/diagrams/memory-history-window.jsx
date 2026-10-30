import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/memory-history-window.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'memoryHistoryWindowDiagram', { content })

// 用图示说明同一份历史，不同的加载窗口。
export function MemoryHistoryWindowDiagram () {
  const { t } = useTranslation('memoryHistoryWindowDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={510} label={d.caption}>{marker => <>
    <rect x='15' y='10' width='265' height='335' rx='14' fill='#fafaf9' stroke='#d6d3d1' />
    <text x='147' y='43' textAnchor='middle' fontSize='16' fontWeight='600' fill='#292524'>{d.saved}</text>
    {[d.a, d.b, d.c, d.d].map((label, i) => <g key={label}><rect x='30' y={65 + i * 65} width='235' height='45' rx='8' fill='#fff' stroke='#e7e5e4' /><text x='147' y={94 + i * 65} textAnchor='middle' fontSize='14' fill='#57534e'>{label}</text></g>)}
    <Arrow d='M 280 165 H 305 V 70 H 328' marker={marker} />
    <Arrow d='M 280 165 H 305 V 240 H 328' marker={marker} />
    <rect x='330' y='10' width='255' height='145' rx='14' fill='#eff6ff' stroke='#93c5fd' />
    <text x='457' y='42' textAnchor='middle' fontSize='16' fontWeight='600' fill='#292524'>{d.small}</text>
    <text x='457' y='86' textAnchor='middle' fontSize='14' fill='#57534e'>{d.c}</text>
    <text x='457' y='123' textAnchor='middle' fontSize='14' fill='#57534e'>{d.d}</text>
    <rect x='330' y='195' width='255' height='200' rx='14' fill='#eff6ff' stroke='#93c5fd' />
    <text x='457' y='227' textAnchor='middle' fontSize='16' fontWeight='600' fill='#292524'>{d.large}</text>
    {[d.a, d.b, d.c, d.d].map((label, i) => <text key={label} x='457' y={265 + i * 35} textAnchor='middle' fontSize='14' fill='#57534e'>{label}</text>)}
    <Node x={30} y={430} width={540} title={d.current} />
  </>}</DiagramSvg></DiagramFrame>
}
