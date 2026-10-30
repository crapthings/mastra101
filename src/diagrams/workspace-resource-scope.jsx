import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/workspace-resource-scope.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'workspaceResourceScopeDiagram', { content })

// 用图示说明同名文件可以属于不同资料范围。
export function WorkspaceResourceScopeDiagram () {
  const { t } = useTranslation('workspaceResourceScopeDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={380} label={d.caption}>{marker => <>
    <Node x={25} y={10} width={260} title={d.a} />
    <Node x={315} y={10} width={260} title={d.b} />
    <Arrow d='M 155 74 V 138' marker={marker} />
    <Arrow d='M 445 74 V 138' marker={marker} />
    <Node x={25} y={140} width={260} title={d.fa} subtitle={d.file} active />
    <Node x={315} y={140} width={260} title={d.fb} subtitle={d.file} active />
    <Arrow d='M 155 204 V 268' marker={marker} />
    <Arrow d='M 445 204 V 268' marker={marker} />
    <Node x={25} y={270} width={260} title={d.ca} />
    <Node x={315} y={270} width={260} title={d.cb} />
  </>}</DiagramSvg></DiagramFrame>
}
