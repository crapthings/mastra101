import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/video-storyboard.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'videoStoryboardDiagram', { content })

// 用图示说明按时间排成 4×4 故事板，不执行实际模型处理。
export function VideoStoryboardDiagram () {
  const { t } = useTranslation('videoStoryboardDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={530} label={d.caption}>{marker => <>

    <text x='300' y='28' textAnchor='middle' fontSize='14' fill='#57534e'>{d.order}</text>
    {d.frames.map((frame, index) => <g key={frame.title}>
      <rect x={35 + index % 4 * 135} y={50 + Math.floor(index / 4) * 88} width='125' height='76' rx='8' fill='#fafaf9' stroke='#d6d3d1' />
      <text x={97.5 + index % 4 * 135} y={80 + Math.floor(index / 4) * 88} textAnchor='middle' fontSize='15' fontWeight='600' fill='#292524'>{frame.title}</text>
      <text x={97.5 + index % 4 * 135} y={105 + Math.floor(index / 4) * 88} textAnchor='middle' fontSize='13' fill='#57534e'>{frame.time}</text>
    </g>)}
    <Arrow d='M 300 390 V 443' marker={marker} />
    <Node x={65} y={445} width={470} title={d.input} subtitle={d.inputDetail} active />
  </>}</DiagramSvg></DiagramFrame>
}
