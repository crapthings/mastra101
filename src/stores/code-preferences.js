import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

// Persist only the validated code-language choice, defaulting new readers to JavaScript.
export const useCodePreferences = create(persist(
  set => ({
    language: 'js',
    setLanguage: language => set({ language: language === 'ts' ? 'ts' : 'js' })
  }),
  {
    name: 'mastra-journey-code-preferences',
    version: 1,
    storage: createJSONStorage(() => localStorage),
    partialize: state => ({ language: state.language }),
    merge: (saved, current) => ({ ...current, language: saved?.language === 'ts' ? 'ts' : 'js' })
  }
))
