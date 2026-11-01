import { publicUrl } from '@/lib/public-url'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { CodeBlock } from '@/components/code-block'
import { useCodePreferences } from '@/stores/code-preferences'

// Render explicitly marked terms as semantic emphasis without interpreting HTML.
function renderTerms (text) {
  return text.split(/(\*\*[^*\n]+\*\*)/g).map((part, index) => (
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={index} className='font-bold text-stone-900'>{part.slice(2, -2)}</strong>
      : part
  ))
}

// Shared typography presents independently loaded lesson content consistently.
export function Lesson ({ resources, chapter, number, previous, next, Diagram, diagramAfterSection }) {
  const { i18n, t } = useTranslation()
  const language = useCodePreferences(state => state.language)
  const base = resources[i18n.resolvedLanguage] || resources.en
  const content = { ...base, ...base.codeVariants?.[language] }
  const code = content.code
  return (
    <article className='mx-auto max-w-[46rem] [font-family:ui-serif,"Songti_SC","STSong","SimSun",serif]'>
      <p className='mb-10 font-sans text-xs tracking-wide text-stone-500'>{t('foundation')} / {t(`chapters.${chapter}`)}</p>
      <p className='mb-5 font-sans text-sm font-medium text-orange-700'>第 {number} 节</p>
      <h1 className='text-[2rem] font-semibold leading-snug text-stone-900 md:text-[2.5rem]'>{content.title}</h1>
      <p className='mt-5 text-lg leading-[1.9] text-stone-600'>{content.lead}</p>
      <div className='my-10 h-px bg-stone-200' />
      {content.sections.map((section, index) => (
        <section key={index} className='mb-12'>
          <h2 className='mb-5 text-xl font-semibold leading-relaxed text-stone-900'>{section.title}</h2>
          <div className='space-y-5 text-[1.0625rem] leading-[2] text-stone-700 [overflow-wrap:anywhere]'>
            {section.body.split('\n').filter(Boolean).map((paragraph, paragraphIndex) => <p key={paragraphIndex} className={section.noIndent ? undefined : 'indent-[2em]'}>{renderTerms(paragraph)}</p>)}
          </div>
          {section.table && (
            <div className='my-7 overflow-x-auto rounded-lg border border-stone-200' tabIndex={0} role='group' aria-label={section.title}>
              <table className='w-full min-w-[440px] border-collapse text-left text-sm leading-7'>
                <caption className='sr-only'>{section.title}</caption>
                <thead className='bg-stone-100/70'><tr>{section.table.headers.map(header => <th key={header} scope='col' className='px-4 py-3 font-semibold text-stone-800'>{header}</th>)}</tr></thead>
                <tbody>{section.table.rows.map((row, rowIndex) => <tr key={rowIndex} className='border-t border-stone-200'>{row.map((cell, cellIndex) => cellIndex === 0 ? <th key={cellIndex} scope='row' className='px-4 py-3 font-medium text-stone-800'>{cell}</th> : <td key={cellIndex} className='px-4 py-3 text-stone-600'>{cell}</td>)}</tr>)}</tbody>
              </table>
            </div>
          )}
          {section.links && <ul className='my-4 flex flex-wrap gap-x-5 gap-y-2 font-sans text-sm text-stone-600'>{section.links.map(link => <li key={link.href}><a href={publicUrl(link.href)} target='_blank' rel='noreferrer' className='underline decoration-stone-300 underline-offset-4 hover:text-stone-900'>{link.label}</a></li>)}</ul>}
          {section.image && <figure className='my-7'><img src={publicUrl(section.image.src)} alt={section.image.alt} width={section.image.width} height={section.image.height} loading='lazy' className='h-auto w-full rounded-xl border border-stone-200' /><figcaption className='mt-3 font-sans text-sm leading-7 text-stone-500'>{section.image.caption}</figcaption></figure>}
          {section.download && <a href={publicUrl(section.download.href)} download className='mt-5 inline-block rounded-lg border border-stone-300 bg-white px-4 py-3 font-sans text-sm font-medium text-stone-800 underline decoration-stone-300 underline-offset-4 hover:bg-stone-100'>{section.download.label}</a>}
          {section.codeBlocks?.map((block, blockIndex) => <CodeBlock key={blockIndex} label={block.label} code={block.code} language={block.language} />)}
          {Diagram && index === diagramAfterSection && <Diagram />}
          {section.callouts?.map((callout, calloutIndex) => (
            <aside key={calloutIndex} className={`my-7 rounded-r-lg border-l-2 px-5 py-5 sm:px-6 ${callout.type === 'key' ? 'border-emerald-600 bg-emerald-50 text-emerald-950' : 'border-red-600 bg-red-50 text-red-950'}`}>
              <p className='mb-1 text-sm font-semibold'>{t(`callouts.${callout.type}`)}</p>
              <p className='text-base leading-[1.9]'>{callout.body}</p>
            </aside>
          ))}
          {code && index === (content.codeAfterSection ?? content.sections.length - 1) && (
            <CodeBlock label={`${chapter === 'agent' ? 'agent' : 'example'}.${language}`} code={code} />
          )}
        </section>
      ))}
      <aside className='my-10 rounded-r-lg border-l-2 border-orange-500 bg-orange-50 px-6 py-5'>
        <p className='mb-2 text-sm font-semibold text-orange-900'>{content.noteTitle}</p>
        <p className='text-base leading-[1.9] text-stone-700'>{content.note}</p>
        {content.checkAnswer && (
          <Disclosure as='div' className='mt-4'>
            <DisclosureButton className='rounded text-sm font-medium text-orange-900 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-700'>{t('checkAnswer')}</DisclosureButton>
            <DisclosurePanel className='mt-4 space-y-3 border-t border-orange-200 pt-4 text-base leading-[1.9] text-stone-700'>
              {content.checkAnswer.split('\n').filter(Boolean).map((paragraph, index) => <p key={index}>{renderTerms(paragraph)}</p>)}
            </DisclosurePanel>
          </Disclosure>
        )}
      </aside>
      <nav aria-label={t('pagination')} className='mt-14 flex font-sans justify-between gap-4 border-t border-stone-200 pt-6'>{previous ? <Link className='text-sm text-stone-500 hover:text-orange-700' to={previous}>← {t('previous')}</Link> : <span />} {next && <Link className='text-sm font-medium hover:text-orange-700' to={next}>{t('next')} →</Link>}</nav>
    </article>
  )
}
