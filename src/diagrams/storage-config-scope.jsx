import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/storage-config-scope.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'storageConfigScopeDiagram', { content })

// 用图示说明同一实例，共享配置与局部覆盖。
export function StorageConfigScopeDiagram () {
  const { t } = useTranslation('storageConfigScopeDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={390} label={d.caption}>{marker => <>
    <rect x='15' y='10' width='570' height='160' rx='14' fill='#fafaf9' stroke='#d6d3d1' />
    <text x='300' y='42' textAnchor='middle' fontSize='16' fontWeight='600' fill='#292524'>{d.instance}</text>
    <Node x={35} y={70} width={250} title={d.sharedAgent} subtitle={d.sharedDetail} />
    <Node x={315} y={70} width={250} title={d.privateAgent} subtitle={d.privateDetail} />
    <Arrow d='M 160 134 V 218' marker={marker} />
    <Arrow d='M 440 134 V 218' marker={marker} />
    <Node x={35} y={220} width={250} title={d.shared} subtitle={d.sharedStore} active />
    <Node x={315} y={220} width={250} title={d.private} subtitle={d.privateStore} active />
    <text x='300' y='350' textAnchor='middle' fontSize='14' fill='#57534e'>{d.other}</text>
    <Arrow d='M 155 342 H 20 V 252 H 33' marker={marker} />
  </>}</DiagramSvg></DiagramFrame>
}
