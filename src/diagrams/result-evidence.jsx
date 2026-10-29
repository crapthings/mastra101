import { useState } from 'react'
import { Button } from '@headlessui/react'
import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/result-evidence.zh.json'
import { DiagramFrame, DiagramSvg, Arrow } from './frame'

i18n.addResourceBundle('zh', 'resultEvidenceDiagram', { content })

// Compare consistent success and failure records without claiming to run a model or read the clock.
export function ResultEvidenceDiagram () {
  const [scenario, setScenario] = useState(0)
  const { t } = useTranslation('resultEvidenceDiagram')
  const d = t('content', { returnObjects: true })
  const selected = d.scenarios[scenario]
  return <DiagramFrame title={d.title} caption={d.caption} controls={d.scenarios.map((item, index) => <Button key={item.label} aria-pressed={scenario === index} onClick={() => setScenario(index)} className={`rounded-full border px-4 py-2 text-sm ${scenario === index ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-stone-200 hover:bg-stone-100'}`}>{item.label}</Button>)}>
    <p aria-live='polite' className='min-h-16 px-2 pb-3 text-sm leading-7 text-stone-600'>{selected.summary}</p>
    <DiagramSvg height={405} label={selected.summary}>{marker => <>
      {selected.cards.map((card, index) => <g key={card.title}>
        <rect x='35' y={10 + index * 140} width='530' height='108' rx='12' fill='#fafaf9' stroke='#d6d3d1' />
        <text x='300' y={38 + index * 140} textAnchor='middle' fontSize='16' fontWeight='600' fill='#292524'>{card.title}</text>
        {card.lines.map((line, lineIndex) => <text key={lineIndex} x='300' y={65 + index * 140 + lineIndex * 23} textAnchor='middle' fontSize='14' fill='#57534e'>{line}</text>)}
        {index < 2 && <Arrow d={`M 300 ${118 + index * 140} V ${148 + index * 140}`} marker={marker} />}
      </g>)}
    </>}</DiagramSvg>
  </DiagramFrame>
}
