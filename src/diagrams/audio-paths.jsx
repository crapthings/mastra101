import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/audio-paths.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'audioPathsDiagram', { content })

// 用图示说明直接处理声音，或先转成文字，不执行实际模型处理。
export function AudioPathsDiagram () {
  const { t } = useTranslation('audioPathsDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={475} label={d.caption}>{marker => <>

    <Node x={100} y={10} width={400} title={d.audio} subtitle={d.audioDetail} />
    <Arrow d='M 210 74 V 110 H 155 V 143' marker={marker} />
    <Arrow d='M 390 74 V 110 H 445 V 143' marker={marker} />
    <Node x={25} y={145} width={260} title={d.direct} subtitle={d.directDetail} />
    <Node x={315} y={145} width={260} title={d.transcribe} subtitle={d.transcribeDetail} />
    <Arrow d='M 445 209 V 268' marker={marker} />
    <Node x={315} y={270} width={260} title={d.text} subtitle={d.textDetail} />
    <Arrow d='M 155 209 V 360 H 240 V 393' marker={marker} />
    <Arrow d='M 445 334 V 360 H 360 V 393' marker={marker} />
    <Node x={65} y={395} width={470} title={d.result} subtitle={d.resultDetail} active />
  </>}</DiagramSvg></DiagramFrame>
}
