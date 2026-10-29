import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/core-memory.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'coreMemoryDiagram', { content })

// 用静态关系图解释保存的信息怎样进入一次调用，不执行模型或外部操作。
export function CoreMemoryDiagram () {
  const { t } = useTranslation('coreMemoryDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={500} label={d.caption}>{marker => <>

    <Node x={30} y={15} width={330} title={d.storage} subtitle={d.storageDetail} />
    <Arrow d='M 195 79 V 138' marker={marker} label={d.read} x={240} y={113} />
    <Node x={30} y={140} width={330} title={d.memory} subtitle={d.memoryDetail} />
    <Arrow d='M 195 204 V 263' marker={marker} label={d.select} x={265} y={238} />
    <Node x={380} y={140} width={195} title={d.current} subtitle={d.currentDetail} />
    <Arrow d='M 477 204 V 240 H 405 V 263' marker={marker} />
    <Node x={75} y={265} width={450} title={d.context} subtitle={d.contextDetail} active />
    <Arrow d='M 300 329 V 398' marker={marker} />
    <Node x={165} y={400} width={270} title={d.model} />
  </>}</DiagramSvg></DiagramFrame>
}
