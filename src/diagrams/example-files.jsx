import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import { useCodePreferences } from '@/stores/code-preferences'
import content from '@/locales/diagrams/example-files.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'exampleFilesDiagram', { content })

// Map the actual sample files while following the shared persisted language selection.
export function ExampleFilesDiagram () {
  const { t } = useTranslation('exampleFilesDiagram')
  const language = useCodePreferences(state => state.language)
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={520} label={d.caption}>{marker => <>
    <Node x={30} y={20} width={240} title={`src/basic.${language}`} subtitle={d.basic} />
    <Node x={330} y={20} width={240} title={`src/run.${language}`} subtitle={d.run} />
    <text x='150' y='117' textAnchor='middle' fontSize='13' fill='#57534e'>{d.standalone}</text>
    <Node x={310} y={150} width={280} title={`agents/time-agent.${language}`} subtitle={d.agent} />
    <Arrow d='M 450 84 V 148' marker={marker} label={d.importAgent} x={513} y={123} />
    <Node x={310} y={280} width={280} title={`tools/time-tool.${language}`} subtitle={d.tool} />
    <Arrow d='M 450 214 V 278' marker={marker} label={d.attach} x={510} y={250} />
    <Node x={310} y={410} width={280} title={`tools/read-time.${language}`} subtitle={d.clock} />
    <Arrow d='M 450 344 V 408' marker={marker} label={d.execute} x={510} y={382} />
    <Node x={15} y={280} width={260} title={`src/clock.${language}`} subtitle={d.direct} />
    <Arrow d='M 145 344 V 442 H 308' marker={marker} label={d.invoke} x={222} y={429} />
    <text x='300' y='507' textAnchor='middle' fontSize='13' fill='#57534e'>{d.config}</text>
  </>}</DiagramSvg></DiagramFrame>
}
