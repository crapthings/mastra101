import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/core-skills.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'coreSkillsDiagram', { content })

// 用静态关系图解释技能提供方法，工具提供执行能力，不执行模型或外部操作。
export function CoreSkillsDiagram () {
  const { t } = useTranslation('coreSkillsDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={420} label={d.caption}>{marker => <>

    <Node x={100} y={10} width={400} title={d.skill} subtitle={d.skillDetail} />
    <Arrow d='M 300 74 V 153' marker={marker} label={d.load} x={375} y={118} />
    <Node x={100} y={155} width={400} title={d.agent} subtitle={d.agentDetail} active />
    <Arrow d='M 220 219 V 323' marker={marker} label={d.call} x={150} y={275} />
    <Arrow d='M 380 325 V 221' marker={marker} label={d.return} x={450} y={275} />
    <Node x={100} y={325} width={400} title={d.tool} subtitle={d.toolDetail} />
  </>}</DiagramSvg></DiagramFrame>
}
