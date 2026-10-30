import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/sandbox-boundaries.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'sandboxBoundariesDiagram', { content })

// 用图示说明文件接口、执行位置与系统隔离分开配置。
export function SandboxBoundariesDiagram () {
  const { t } = useTranslation('sandboxBoundariesDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={410} label={d.caption}>{marker => <>
    <Node x={20} y={10} width={270} title={d.fs} subtitle={d.fsDetail} />
    <Node x={310} y={10} width={270} title={d.cmd} subtitle={d.cmdDetail} />
    <Arrow d='M 155 74 V 148' marker={marker} />
    <Arrow d='M 445 74 V 148' marker={marker} />
    <Node x={20} y={150} width={270} title={d.files} subtitle={d.filesDetail} />
    <Node x={310} y={150} width={270} title={d.host} subtitle={d.hostDetail} />
    <Arrow d='M 445 214 V 288' marker={marker} />
    <Node x={310} y={290} width={270} title={d.policy} subtitle={d.policyDetail} active />
    <text x='155' y='320' textAnchor='middle' fontSize='13' fill='#57534e'>{d.note}</text>
  </>}</DiagramSvg></DiagramFrame>
}
