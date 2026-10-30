import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, useLocation } from 'react-router'
import { chapters } from '@/curriculum'
import { useNavigationDrawer } from '@/stores/navigation'
import { CodeLanguageSwitch } from './code-language-switch'

// Share the collapsible chapter list between the desktop sidebar and mobile drawer.
export function ChapterNavigation () {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const close = useNavigationDrawer(state => state.close)
  return (
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
            {chapter.lessons.map(lesson => <li key={lesson.id}><NavLink end to={lesson.path} onClick={close} className={({ isActive }) => `block rounded-lg px-3 py-2.5 text-sm leading-relaxed transition-colors ${isActive ? 'bg-orange-100/70 font-medium text-orange-900' : 'text-stone-500 hover:bg-stone-100'}`}>{t(`lessons.${lesson.id}`)}</NavLink></li>)}
          </DisclosurePanel>
        </Disclosure>
      ))}
    </nav>
  )
}

// Keep mobile navigation dismissible, keyboard accessible and positioned at the current lesson.
export function MobileNavigation () {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const isOpen = useNavigationDrawer(state => state.isOpen)
  const close = useNavigationDrawer(state => state.close)
  const navigationRef = useRef(null)

  useEffect(() => { close() }, [pathname, close])

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)')
    const closeOnDesktop = () => { if (desktop.matches) close() }
    closeOnDesktop()
    desktop.addEventListener('change', closeOnDesktop)
    return () => desktop.removeEventListener('change', closeOnDesktop)
  }, [close])

  useEffect(() => {
    if (!isOpen) return
    const frame = requestAnimationFrame(() => {
      const container = navigationRef.current
      const active = container?.querySelector('[aria-current="page"]')
      if (active) container.scrollTop += active.getBoundingClientRect().top - container.getBoundingClientRect().top - container.clientHeight / 3
    })
    return () => cancelAnimationFrame(frame)
  }, [isOpen])

  return (
    <Dialog id='mobile-contents' open={isOpen} onClose={close} className='relative z-50 md:hidden'>
      <DialogBackdrop transition className='fixed inset-0 bg-stone-950/35 transition-opacity duration-200 data-closed:opacity-0 motion-reduce:transition-none' />
      <div className='fixed inset-0 flex justify-end'>
        <DialogPanel transition className='flex h-dvh w-[min(90vw,24rem)] flex-col bg-[#faf9f6] text-stone-800 shadow-xl transition-transform duration-200 ease-out data-closed:translate-x-full motion-reduce:transition-none'>
          <div className='shrink-0 border-b border-stone-200 px-6 pt-[max(1rem,env(safe-area-inset-top))] pb-4'>
            <div className='flex items-center justify-between gap-4'>
              <DialogTitle className='font-semibold'>{t('contents')}</DialogTitle>
              <button type='button' data-autofocus onClick={close} aria-label={t('closeContents')} className='flex size-11 items-center justify-center rounded-lg text-stone-500 hover:bg-stone-200/60 hover:text-stone-900'>
                <svg aria-hidden='true' viewBox='0 0 24 24' fill='none' className='size-5'><path d='m6 6 12 12M6 18 18 6' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' /></svg>
              </button>
            </div>
            <div className='mt-3 flex items-center justify-between gap-4'><span className='text-xs text-stone-500'>{t('code.language')}</span><CodeLanguageSwitch /></div>
          </div>
          <div ref={navigationRef} className='min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]'>
            <ChapterNavigation />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
