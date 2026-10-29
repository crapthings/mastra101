import { Radio, RadioGroup } from '@headlessui/react'
import { useTranslation } from 'react-i18next'
import { useCodePreferences } from '@/stores/code-preferences'

// Every selector updates the same persisted language without passing actions through lesson props.
export function CodeLanguageSwitch () {
  const { t } = useTranslation()
  const language = useCodePreferences(state => state.language)
  const setLanguage = useCodePreferences(state => state.setLanguage)
  return (
    <RadioGroup value={language} onChange={setLanguage} aria-label={t('code.language')} className='inline-flex shrink-0 rounded-lg border border-stone-300 bg-stone-100 p-1 font-sans text-xs text-stone-600'>
      {['js', 'ts'].map(value => <Radio key={value} value={value} aria-label={t(`code.${value}`)} className='cursor-pointer rounded-md px-3 py-1.5 font-medium outline-offset-2 data-checked:bg-white data-checked:text-stone-900 data-checked:shadow-sm data-focus:outline-2 data-focus:outline-orange-600'>{value.toUpperCase()}</Radio>)}
    </RadioGroup>
  )
}
