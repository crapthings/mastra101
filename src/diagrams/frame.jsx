import { useId } from 'react'

// A figure keeps its SVG readable on small screens and supplies a text description.
export function DiagramFrame ({ title, caption, children, controls }) {
  const id = useId()
  return (
    <figure aria-labelledby={id} className='my-8 overflow-hidden rounded-xl border border-stone-200 bg-white/70 font-sans'>
      <figcaption id={id} className='px-5 pt-5 text-base font-semibold text-stone-800'>{title}</figcaption>
      {controls && <div className='flex flex-wrap gap-2 px-5 pt-4'>{controls}</div>}
      <div className='overflow-x-auto p-3 sm:p-5' tabIndex={0} role='group' aria-label={title}>{children}</div>
      <p className='border-t border-stone-100 px-5 py-4 text-sm leading-7 text-stone-600'>{caption}</p>
    </figure>
  )
}

// Each SVG has unique arrow markers and an accessible description.
export function DiagramSvg ({ height, label, children }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox={`0 0 600 ${height}`} role='img' aria-label={label} className='mx-auto block w-full min-w-[440px] max-w-[600px] text-stone-600'>
      <defs><marker id={id} viewBox='0 0 10 10' refX='9' refY='5' markerWidth='6' markerHeight='6' orient='auto-start-reverse'><path d='M 0 0 L 10 5 L 0 10 z' fill='currentColor' /></marker></defs>
      {children(id)}
    </svg>
  )
}

// A node uses a neutral border or a blue active state without implying success or failure.
export function Node ({ x, y, width = 180, title, subtitle, active = false, dashed = false }) {
  return (
    <g>
      <rect x={x} y={y} width={width} height='64' rx='10' fill={active ? '#eff6ff' : '#fafaf9'} stroke={active ? '#2563eb' : '#d6d3d1'} strokeWidth={active ? 2 : 1} strokeDasharray={dashed ? '5 4' : undefined} />
      <text x={x + width / 2} y={y + (subtitle ? 26 : 38)} textAnchor='middle' fill='#292524' fontSize='16' fontWeight='600'>{title}</text>
      {subtitle && <text x={x + width / 2} y={y + 48} textAnchor='middle' fill='#57534e' fontSize='13'>{subtitle}</text>}
    </g>
  )
}

// A labeled connector makes direction explicit without relying on motion.
export function Arrow ({ d, marker, label, x, y }) {
  return <g><path d={d} fill='none' stroke='currentColor' strokeWidth='1.5' markerEnd={`url(#${marker})`} />{label && <text x={x} y={y} textAnchor='middle' fill='#57534e' fontSize='13'>{label}</text>}</g>
}
