import { Lesson } from './lesson'
import zh from '@/locales/lessons/prompts.zh.json'
import en from '@/locales/lessons/prompts.en.json'

// This route loads one lesson and its bilingual content.
export function Component () {
  return <Lesson resources={{ zh, en }} chapter='llm' number={2} previous='/llm' next='/llm/context' />
}
