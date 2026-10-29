import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { chapters } from '@/curriculum'
import { CodeLanguageSwitch } from '@/components/code-language-switch'
import { useTranslation } from 'react-i18next'
import { NavLink, Outlet, ScrollRestoration, useLocation, useNavigation, useRouteError } from 'react-router'

// The reading shell keeps navigation independent of lazy lesson modules.
export function App () {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { pathname } = useLocation()
  return (
    <div className='min-h-screen bg-[#faf9f6] text-stone-800 selection:bg-orange-200'>
      <a href='#content' className='sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-4'>{t('skip')}</a>
      <header className='flex min-h-20 flex-wrap items-center justify-between gap-4 border-b border-stone-200 px-6 py-4 lg:px-10'>
        <NavLink to='/llm' className='flex items-baseline gap-3 font-semibold tracking-tight'><span className='text-2xl'>mastra<span className='text-orange-600'>.</span></span><span className='text-xs font-normal tracking-[0.2em] text-stone-500'>JOURNEY</span></NavLink>
        <div className='flex items-center gap-4'><span className='rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-900'>{t('wip')}</span><CodeLanguageSwitch /></div>
      </header>
      <div className='mx-auto grid max-w-[1600px] md:grid-cols-[270px_1fr]'>
        <aside className='border-b border-stone-200 p-6 md:sticky md:top-0 md:h-[calc(100dvh-5rem)] md:overflow-y-auto md:border-r md:border-b-0 lg:p-8'>
          <p className='mb-8 text-sm font-medium text-stone-500'>{t('contents')}</p>
          <nav aria-label={t('contents')} className='space-y-3'>
            {chapters.map((chapter, chapterIndex) => (
              <Disclosure as='section' key={`${chapter.id}:${pathname}`} defaultOpen={chapter.lessons.some(lesson => lesson.path === pathname)}>
                <h2>
                  <DisclosureButton className='group flex w-full items-center gap-3 rounded-lg py-3 text-left text-sm font-semibold hover:text-orange-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600'>
                    <span className='text-xs tabular-nums text-orange-700'>{String(chapterIndex + 1).padStart(2, '0')}</span>
                    <span className='flex-1'>{t(`chapters.${chapter.id}`)}</span>
                    <svg aria-hidden='true' viewBox='0 0 20 20' fill='none' className='size-4 shrink-0 text-stone-400 transition-transform group-data-open:rotate-90 motion-reduce:transition-none'>
                      <path d='m7 5 5 5-5 5' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
                    </svg>
                  </DisclosureButton>
                </h2>
                <DisclosurePanel as='ul' className='mb-3 ml-2 space-y-1 border-l border-stone-200 pl-3'>
                  {chapter.lessons.map(lesson => <li key={lesson.id}><NavLink end to={lesson.path} className={({ isActive }) => `block rounded-lg px-3 py-2.5 text-sm leading-relaxed transition-colors ${isActive ? 'bg-orange-100/70 font-medium text-orange-900' : 'text-stone-500 hover:bg-stone-100'}`}>{t(`lessons.${lesson.id}`)}</NavLink></li>)}
                </DisclosurePanel>
              </Disclosure>
            ))}
          </nav>
        </aside>
        <main id='content' tabIndex={-1} className='min-w-0 px-6 py-10 md:px-12 lg:px-20 lg:py-14'>
          <div role='status' className='sr-only'>{navigation.state !== 'idle' ? t('loading') : ''}</div>
          <Outlet />
        </main>
      </div>
      <ScrollRestoration />
    </div>
  )
}

// Route failures remain recoverable without leaving the book.
export function RouteError () {
  const { t } = useTranslation()
  const error = useRouteError()
  return <div className='p-12'><h1 className='text-2xl'>{t('error')}</h1><p className='my-4 text-stone-500'>{error?.status === 404 ? t('notFound') : t('retry')}</p><NavLink to='/llm' className='underline'>{t('back')}</NavLink></div>
}
