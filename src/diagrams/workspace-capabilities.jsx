import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/workspace-capabilities.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'workspaceCapabilitiesDiagram', { content })

// 用图示说明工作区组织能力，文件系统连接材料。
export function WorkspaceCapabilitiesDiagram () {
  const { t } = useTranslation('workspaceCapabilitiesDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={390} label={d.caption}>{marker => <>
    <Node x={65} y={10} width={470} title={d.workspace} subtitle={d.workspaceDetail} active />
    <Arrow d='M 300 74 V 110 H 100 V 148' marker={marker} />
    <Arrow d='M 300 74 V 148' marker={marker} />
    <Arrow d='M 300 74 V 110 H 500 V 148' marker={marker} />
    <Node x={10} y={150} width={180} title={d.files} subtitle={d.filesDetail} />
    <Node x={210} y={150} width={180} title={d.search} subtitle={d.searchDetail} dashed />
    <Node x={410} y={150} width={180} title={d.skills} subtitle={d.skillsDetail} dashed />
    <Arrow d='M 100 214 V 278' marker={marker} />
    <Node x={10} y={280} width={300} title={d.root} subtitle={d.rootDetail} />
    <text x='450' y='315' textAnchor='middle' fontSize='13' fill='#57534e'>{d.note}</text>
  </>}</DiagramSvg></DiagramFrame>
}
