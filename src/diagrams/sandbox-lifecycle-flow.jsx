import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/sandbox-lifecycle-flow.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'sandboxLifecycleFlowDiagram', { content })

// 用图示说明复用按归属，回收有明确责任。
export function SandboxLifecycleFlowDiagram () {
  const { t } = useTranslation('sandboxLifecycleFlowDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={480} label={d.caption}>{marker => <>
    <Node x={25} y={10} width={260} title={d.a} />
    <Node x={315} y={10} width={260} title={d.b} />
    <Arrow d='M 155 74 V 138' marker={marker} />
    <Arrow d='M 445 74 V 138' marker={marker} />
    <Node x={25} y={140} width={260} title={d.sa} active />
    <Node x={315} y={140} width={260} title={d.sb} active />
    <Arrow d='M 155 204 V 240 H 300 V 278' marker={marker} />
    <Arrow d='M 445 204 V 240 H 300 V 278' marker={marker} />
    <Node x={50} y={280} width={500} title={d.cleanup} subtitle={d.cleanupDetail} />
    <Arrow d='M 300 344 V 398' marker={marker} />
    <Node x={50} y={400} width={500} title={d.artifact} subtitle={d.artifactDetail} />
  </>}</DiagramSvg></DiagramFrame>
}
