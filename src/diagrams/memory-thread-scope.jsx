import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/memory-thread-scope.zh.json'
import { DiagramFrame, DiagramSvg, Node } from './frame'

i18n.addResourceBundle('zh', 'memoryThreadScopeDiagram', { content })

// 用图示说明一个归属，可以拥有多段会话。
export function MemoryThreadScopeDiagram () {
  const { t } = useTranslation('memoryThreadScopeDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={430} label={d.caption}>{() => <>
    <rect x='20' y='10' width='560' height='220' rx='14' fill='#fafaf9' stroke='#d6d3d1' />
    <text x='45' y='42' fontSize='16' fontWeight='600' fill='#292524'>{d.readerA}</text>
    <Node x={40} y={65} width={250} title={d.first} subtitle={d.firstDetail} />
    <Node x={310} y={65} width={250} title={d.second} subtitle={d.secondDetail} />
    <Node x={80} y={150} width={440} title={d.shared} active />
    <rect x='20' y='260' width='560' height='150' rx='14' fill='#fafaf9' stroke='#d6d3d1' />
    <text x='45' y='292' fontSize='16' fontWeight='600' fill='#292524'>{d.readerB}</text>
    <Node x={80} y={315} width={440} title={d.third} subtitle={d.thirdDetail} />
  </>}</DiagramSvg></DiagramFrame>
}
