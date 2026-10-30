import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/skill-package.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'skillPackageDiagram', { content })

// 用图示说明入口写方法，支持文件放细节。
export function SkillPackageDiagram () {
  const { t } = useTranslation('skillPackageDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={310} label={d.caption}>{marker => <>
    <Node x={65} y={10} width={470} title={d.entry} subtitle={d.entryDetail} active />
    <Arrow d='M 300 74 V 130 H 100 V 208' marker={marker} />
    <Arrow d='M 300 74 V 208' marker={marker} />
    <Arrow d='M 300 74 V 130 H 500 V 208' marker={marker} />
    <Node x={10} y={210} width={180} title={d.refs} subtitle={d.refsDetail} />
    <Node x={210} y={210} width={180} title={d.assets} subtitle={d.assetsDetail} />
    <Node x={410} y={210} width={180} title={d.scripts} subtitle={d.scriptsDetail} dashed />
  </>}</DiagramSvg></DiagramFrame>
}
