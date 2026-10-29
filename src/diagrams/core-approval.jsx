import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/core-approval.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'coreApprovalDiagram', { content })

// 用静态关系图解释确认的是动作，暂停的是执行，不执行模型或外部操作。
export function CoreApprovalDiagram () {
  const { t } = useTranslation('coreApprovalDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={510} label={d.caption}>{marker => <>

    <Node x={120} y={10} width={360} title={d.request} subtitle={d.requestDetail} />
    <Arrow d='M 300 74 V 133' marker={marker} />
    <Node x={120} y={135} width={360} title={d.wait} subtitle={d.waitDetail} active />
    <Arrow d='M 210 199 V 235 H 150 V 278' marker={marker} label={d.yes} x={120} y={244} />
    <Arrow d='M 390 199 V 235 H 450 V 278' marker={marker} label={d.no} x={480} y={244} />
    <Node x={30} y={280} width={240} title={d.execute} subtitle={d.executeDetail} />
    <Node x={330} y={280} width={240} title={d.decline} subtitle={d.declineDetail} />
    <Arrow d='M 150 344 V 382 H 240 V 423' marker={marker} />
    <Arrow d='M 450 344 V 382 H 360 V 423' marker={marker} />
    <Node x={100} y={425} width={400} title={d.continue} subtitle={d.continueDetail} />
  </>}</DiagramSvg></DiagramFrame>
}
