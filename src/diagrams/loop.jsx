import { useState } from 'react'
import { Button } from '@headlessui/react'
import { useTranslation } from 'react-i18next'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

// Advance through one illustrative lookup cycle with visible return paths and exits.
export function LoopDiagram () {
  const [step, setStep] = useState(0)
  const { t } = useTranslation()
  const d = t('diagrams.loop', { returnObjects: true })
  const active = d.steps[step].node
  return <DiagramFrame title={d.title} caption={d.caption} controls={<>
    <Button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className='rounded-full border border-stone-200 px-4 py-2 text-sm hover:bg-stone-100 disabled:opacity-40'>{d.previous}</Button>
    <Button onClick={() => setStep(Math.min(d.steps.length - 1, step + 1))} disabled={step === d.steps.length - 1} className='rounded-full border border-blue-600 bg-blue-50 px-4 py-2 text-sm text-blue-900 disabled:opacity-40'>{d.next}</Button>
    <Button onClick={() => setStep(0)} className='rounded-full px-4 py-2 text-sm text-stone-600 hover:bg-stone-100'>{d.reset}</Button>
  </>}>
    <p aria-live='polite' aria-atomic='true' className='min-h-16 px-2 pb-3 text-sm leading-7 text-stone-700'>{step + 1} / {d.steps.length} · {d.steps[step].text}</p>
    <DiagramSvg height={390} label={d.caption}>{marker => <>
      <Node x={40} y={25} title={d.model} active={active === 'model'} />
      <Node x={380} y={25} title={d.answer} active={active === 'answer'} />
      <Node x={40} y={180} title={d.tool} active={active === 'tool'} />
      <Node x={380} y={180} title={d.result} active={active === 'result'} />
      <Node x={40} y={315} width={260} title={d.stop} />
      <Arrow d='M 220 57 H 378' marker={marker} label={d.final} x={300} y={44} />
      <Arrow d='M 130 89 V 178' marker={marker} label={d.request} x={189} y={140} />
      <Arrow d='M 220 212 H 378' marker={marker} label={d.return} x={300} y={199} />
      <Arrow d='M 470 180 V 125 H 265 V 18 H 130 V 23' marker={marker} label={d.again} x={370} y={115} />
      <Arrow d='M 80 244 V 313' marker={marker} label={d.limit} x={183} y={285} />
    </>}</DiagramSvg>
  </DiagramFrame>
}
