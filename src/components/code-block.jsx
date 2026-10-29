import { Fragment, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CodeLanguageSwitch } from './code-language-switch'

// Select a grammar from explicit metadata or a complete source-file label.
function getGrammar (label, language, terminalLabel) {
  if (language) return language
  if (/\.tsx?$/.test(label)) return 'typescript'
  if (/\.jsx?$/.test(label)) return 'javascript'
  if (label.endsWith('.json')) return 'json'
  if (label.startsWith('.env') || label === terminalLabel) return 'bash'
  return 'text'
}

// Highlight lazily while keeping the current source readable during loading or errors.
export function CodeBlock ({ label, code, language }) {
  const { t } = useTranslation()
  const grammar = getGrammar(label, language, t('code.terminal'))
  const [highlighted, setHighlighted] = useState(null)
  const active = highlighted?.code === code && highlighted?.grammar === grammar ? highlighted.result : null

  useEffect(() => {
    let cancelled = false
    if (grammar !== 'text') {
      import('@/lib/highlight-code')
        .then(module => module.highlightCode(code, grammar))
        .then(result => {
          if (!cancelled) setHighlighted({ code, grammar, result })
        })
        .catch(() => {
          if (!cancelled) setHighlighted(null)
        })
    }
    return () => { cancelled = true }
  }, [code, grammar])

  if (grammar === 'text') {
    return (
      <figure className='my-7 overflow-hidden rounded-xl border border-stone-200 bg-white/70'>
        <figcaption className='border-b border-stone-100 px-5 py-3 font-sans text-xs font-medium text-stone-500'>{label}</figcaption>
        <p className='whitespace-pre-wrap px-5 py-5 text-base leading-8 text-stone-700 [overflow-wrap:anywhere]'>{code}</p>
      </figure>
    )
  }

  return (
    <div className='my-7 overflow-hidden rounded-xl border border-stone-800 bg-[#24292e] text-[#e1e4e8]'>
      <div className='flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-3 font-sans text-xs text-stone-300'>
        <span className='break-all'>{label}</span>
        {['javascript', 'typescript'].includes(grammar) && <CodeLanguageSwitch />}
      </div>
      <pre className='overflow-x-auto p-5 font-mono text-sm leading-7' tabIndex={0} aria-label={label}><code>{active ? active.tokens.map((line, lineIndex) => <Fragment key={lineIndex}>{line.map((token, tokenIndex) => <span key={tokenIndex} style={{ color: token.color }}>{token.content}</span>)}{lineIndex < active.tokens.length - 1 ? '\n' : ''}</Fragment>) : code}</code></pre>
    </div>
  )
}
