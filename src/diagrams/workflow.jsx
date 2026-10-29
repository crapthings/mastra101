import { useState } from 'react'
import { Button } from '@headlessui/react'
import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/workflow.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'workflowDiagram', { content })

// Select a user response to inspect the corresponding workflow branch without executing it.
export function WorkflowDiagram () {
  const [branch, setBranch] = useState(2)
  const { t } = useTranslation('workflowDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption} controls={d.choices.map((choice, index) => <Button key={choice} aria-pressed={branch === index} onClick={() => setBranch(index)} className={`rounded-full border px-4 py-2 text-sm ${branch === index ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-stone-200 hover:bg-stone-100'}`}>{choice}</Button>)}>
    <p aria-live='polite' className='min-h-16 px-2 pb-3 text-sm leading-7 text-stone-600'>{d.explanations[branch]}</p>
    <DiagramSvg height={450} label={d.explanations[branch]}>{marker => <>
      <Node x={200} y={20} width={200} title={d.plan} subtitle={d.innerLoop} />
      <Node x={200} y={140} width={200} title={d.confirm} subtitle={d.samePlan} />
      <Arrow d='M 300 84 V 138' marker={marker} />
      <Node x={10} y={285} width={180} title={d.modify} active={branch === 1} />
      <Node x={210} y={285} width={180} title={d.submit} subtitle={d.check} active={branch === 0} />
      <Node x={410} y={285} width={180} title={d.wait} subtitle={d.persist} active={branch === 2} />
      <Arrow d='M 220 204 V 245 H 100 V 283' marker={marker} label={d.choices[1]} x={121} y={230} />
      <Arrow d='M 300 204 V 283' marker={marker} label={d.choices[0]} x={343} y={262} />
      <Arrow d='M 380 204 V 245 H 500 V 283' marker={marker} label={d.choices[2]} x={482} y={230} />
      <Arrow d='M 100 285 V 52 H 198' marker={marker} label={d.revise} x={138} y={38} />
      <Arrow d='M 500 349 V 410 H 598 V 172 H 402' marker={marker} label={d.resume} x={477} y={157} />
    </>}</DiagramSvg>
  </DiagramFrame>
}
