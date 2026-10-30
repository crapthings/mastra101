import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/storage-retention-flow.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'storageRetentionFlowDiagram', { content })

// 用图示说明策略不会自动变成清理任务。
export function StorageRetentionFlowDiagram () {
  const { t } = useTranslation('storageRetentionFlowDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={480} label={d.caption}>{marker => <>
    <Node x={25} y={10} width={260} title={d.old} />
    <Node x={315} y={10} width={260} title={d.new} />
    <Arrow d='M 155 74 V 95 H 300 V 118' marker={marker} />
    <Arrow d='M 445 74 V 95 H 300 V 118' marker={marker} />
    <Node x={60} y={120} width={480} title={d.policy} subtitle={d.policyDetail} />
    <Arrow d='M 300 184 V 228' marker={marker} />
    <Node x={60} y={230} width={480} title={d.prune} subtitle={d.pruneDetail} active />
    <Arrow d='M 300 294 V 320 H 155 V 348' marker={marker} />
    <Arrow d='M 300 294 V 320 H 445 V 348' marker={marker} />
    <Node x={25} y={350} width={260} title={d.removed} />
    <Node x={315} y={350} width={260} title={d.kept} />
    <text x='300' y='458' textAnchor='middle' fontSize='14' fill='#57534e'>{d.check}</text>
  </>}</DiagramSvg></DiagramFrame>
}
