import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/core-run.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'coreRunDiagram', { content })

// 用静态关系图解释配置一次，按任务发起运行，不执行模型或外部操作。
export function CoreRunDiagram () {
  const { t } = useTranslation('coreRunDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={570} label={d.caption}>{marker => <>

    <Node x={100} y={10} width={400} title={d.config} subtitle={d.configDetail} />
    <Arrow d='M 300 74 V 168' marker={marker} label={d.start} x={420} y={110} />
    <rect x='40' y='125' width='520' height='350' rx='14' fill='none' stroke='#a8a29e' strokeDasharray='5 5' />
    <text x='65' y='151' fontSize='14' fill='#57534e'>{d.run}</text>
    <Node x={155} y={170} width={290} title={d.first} subtitle={d.firstDetail} />
    <Arrow d='M 300 234 V 278' marker={marker} label={d.request} x={405} y={260} />
    <Node x={155} y={280} width={290} title={d.tool} subtitle={d.toolDetail} active />
    <Arrow d='M 300 344 V 388' marker={marker} label={d.returned} x={420} y={371} />
    <Node x={155} y={390} width={290} title={d.second} subtitle={d.secondDetail} />
    <Arrow d='M 300 454 V 508' marker={marker} />
    <text x='300' y='540' textAnchor='middle' fontSize='16' fill='#292524'>{d.result}</text>
  </>}</DiagramSvg></DiagramFrame>
}
