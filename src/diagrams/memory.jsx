import { useState } from 'react'
import { Button } from '@headlessui/react'
import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/memory.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'memoryDiagram', { content })

// Change the task to show that stored preferences are selected rather than always injected.
export function MemoryDiagram () {
  const [task, setTask] = useState(0)
  const { t } = useTranslation('memoryDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption} controls={d.tasks.map((label, index) => <Button key={label} aria-pressed={task === index} onClick={() => setTask(index)} className={`rounded-full border px-4 py-2 text-sm ${task === index ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-stone-200 hover:bg-stone-100'}`}>{label}</Button>)}>
    <p aria-live='polite' className='min-h-16 px-2 pb-3 text-sm leading-7 text-stone-600'>{d.explanations[task]}</p>
    <DiagramSvg height={470} label={d.explanations[task]}>{marker => <>
      <Node x={25} y={20} width={250} title={d.saved} subtitle={d.preference} dashed />
      <Node x={325} y={20} width={250} title={d.state} subtitle={d.states[task]} dashed />
      {task === 0 && <Arrow d='M 150 84 V 120 H 260 V 155' marker={marker} label={d.select} x={145} y={143} />}
      <Arrow d='M 450 84 V 120 H 340 V 155' marker={marker} label={d.selectState} x={455} y={143} />
      <rect x='55' y='155' width='490' height='185' rx='12' fill='#eff6ff' stroke='#93c5fd' />
      <text x='300' y='185' textAnchor='middle' fontSize='16' fontWeight='600' fill='#1e3a8a'>{d.context}</text>
      {d.inputs[task].map((line, index) => <text key={line} x='300' y={220 + index * 34} textAnchor='middle' fontSize='15' fill='#292524'>{line}</text>)}
      <Arrow d='M 300 340 V 390' marker={marker} label={d.send} x={347} y={372} />
      <Node x={210} y={392} title={d.model} />
    </>}</DiagramSvg>
  </DiagramFrame>
}
