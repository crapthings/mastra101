import { ChapterNavigation, MobileNavigation } from '@/components/chapter-navigation'
import { useNavigationDrawer } from '@/stores/navigation'
import { CodeLanguageSwitch } from '@/components/code-language-switch'
import { useTranslation } from 'react-i18next'
import { NavLink, Outlet, ScrollRestoration, useNavigation, useRouteError } from 'react-router'

// The reading shell keeps navigation independent of lazy lesson modules.
export function App () {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const isOpen = useNavigationDrawer(state => state.isOpen)
  const open = useNavigationDrawer(state => state.open)
  return (
    <div className='min-h-screen bg-[#faf9f6] text-stone-800 selection:bg-orange-200'>
      <a href='#content' className='sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-4'>{t('skip')}</a>
      <header className='sticky top-0 z-30 flex min-h-20 items-center justify-between gap-4 border-b border-stone-200 bg-[#faf9f6] px-6 py-4 md:static lg:px-10'>
        <NavLink to='/llm' className='flex items-baseline gap-3 font-semibold tracking-tight'><span className='text-2xl'>mastra<span className='text-orange-600'>.</span></span><span className='text-xs font-normal tracking-[0.2em] text-stone-500'>JOURNEY</span></NavLink>
        <div className='hidden items-center gap-4 md:flex'><span className='rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-900'>{t('wip')}</span><CodeLanguageSwitch /></div>
        <button type='button' onClick={open} aria-haspopup='dialog' aria-expanded={isOpen} aria-controls={isOpen ? 'mobile-contents' : undefined} className='flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-medium hover:bg-stone-200/60 md:hidden'>
          <svg aria-hidden='true' viewBox='0 0 24 24' fill='none' className='size-5'><path d='M4 6h16M4 12h16M4 18h16' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' /></svg>
          {t('openContents')}
        </button>
      </header>
      <MobileNavigation />
      <div className='mx-auto grid max-w-[1600px] md:grid-cols-[270px_1fr]'>
        <aside className='hidden border-stone-200 p-6 md:sticky md:top-0 md:block md:h-dvh md:overflow-y-auto md:border-r lg:p-8'>
          <p className='mb-8 text-sm font-medium text-stone-500'>{t('contents')}</p>
          <ChapterNavigation />
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
