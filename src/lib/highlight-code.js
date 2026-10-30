import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

// Limit browser chunks to the grammars actually used by the tutorial.
const grammars = {
  markdown: () => import('shiki/langs/markdown.mjs'),
  javascript: () => import('shiki/langs/javascript.mjs'),
  typescript: () => import('shiki/langs/typescript.mjs'),
  json: () => import('shiki/langs/json.mjs'),
  jsonl: () => import('shiki/langs/jsonl.mjs'),
  yaml: () => import('shiki/langs/yaml.mjs'),
  xml: () => import('shiki/langs/xml.mjs'),
  csv: () => import('shiki/langs/csv.mjs'),
  bash: () => import('shiki/langs/bash.mjs'),
  dockerfile: () => import('shiki/langs/dockerfile.mjs')
}

// Reuse one theme and regex engine across all mounted code blocks.
let highlighterPromise

// Share pending grammar loads when several blocks request the same language.
const languagePromises = new Map()

// Return colored tokens so React can escape code instead of injecting generated HTML.
export async function highlightCode (code, language) {
  if (!grammars[language]) return null
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [import('shiki/themes/github-dark.mjs')],
      langs: [],
      engine: createJavaScriptRegexEngine()
    }).catch(error => {
      highlighterPromise = undefined
      throw error
    })
  }
  const highlighter = await highlighterPromise
  if (!languagePromises.has(language)) {
    languagePromises.set(language, highlighter.loadLanguage(grammars[language]()).catch(error => {
      languagePromises.delete(language)
      throw error
    }))
  }
  await languagePromises.get(language)
  return highlighter.codeToTokens(code, { lang: language, theme: 'github-dark' })
}
