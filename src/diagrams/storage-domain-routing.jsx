import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/storage-domain-routing.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'storageDomainRoutingDiagram', { content })

// 用图示说明组合存储按领域选择后端。
export function StorageDomainRoutingDiagram () {
  const { t } = useTranslation('storageDomainRoutingDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={380} label={d.caption}>{marker => <>
    <Node x={75} y={10} width={450} title={d.router} subtitle={d.routerDetail} active />
    <Arrow d='M 300 74 V 110 H 100 V 148' marker={marker} />
    <Arrow d='M 300 74 V 148' marker={marker} />
    <Arrow d='M 300 74 V 110 H 500 V 148' marker={marker} />
    <Node x={15} y={150} width={170} title={d.memory} />
    <Node x={215} y={150} width={170} title={d.workflow} />
    <Node x={415} y={150} width={170} title={d.scores} />
    <Arrow d='M 100 214 V 278' marker={marker} />
    <Arrow d='M 300 214 V 250 H 420 V 278' marker={marker} />
    <Arrow d='M 500 214 V 250 H 420 V 278' marker={marker} />
    <Node x={10} y={280} width={265} title={d.override} subtitle={d.overrideDetail} active />
    <Node x={295} y={280} width={295} title={d.fallback} subtitle={d.fallbackDetail} active />
  </>}</DiagramSvg></DiagramFrame>
}
