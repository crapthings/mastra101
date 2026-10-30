import { useState } from 'react'
import { Button } from '@headlessui/react'
import { useTranslation } from 'react-i18next'
import { DiagramFrame, DiagramSvg, Node } from './frame'

// Switch between requests to reveal the history sent with a follow-up question.
export function ContextDiagram () {
  const [round, setRound] = useState(0)
  const { t } = useTranslation()
  const d = t('diagrams.context', { returnObjects: true })
  const labels = t('diagrams.rounds', { returnObjects: true })
  const rows = round === 0 ? d.rows.slice(0, 2) : d.rows
  return <DiagramFrame title={d.title} caption={d.captions[round]} controls={labels.map((label, index) => <Button key={label} aria-pressed={round === index} onClick={() => setRound(index)} className={`rounded-full border px-4 py-2 text-sm ${round === index ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-stone-200 hover:bg-stone-100'}`}>{label}</Button>)}>
    <div aria-live='polite' className='px-2 pb-2 text-sm text-stone-500'>{d.requests[round]}</div>
    <DiagramSvg height={round === 0 ? 214 : 380} label={d.captions[round]}>{() => <>
      <rect x='20' y='10' width='560' height={round === 0 ? 194 : 360} rx='12' fill='none' stroke='#a8a29e' strokeDasharray='5 5' />
      {rows.map((row, index) => <Node key={row.title} x={40} y={30 + index * 83} width={520} title={row.title} subtitle={row.body} active={round === 1 && index === 3} />)}
    </>}</DiagramSvg>
  </DiagramFrame>
}
