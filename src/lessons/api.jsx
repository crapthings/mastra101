import { Lesson } from './lesson'
import zh from '@/locales/lessons/api.zh.json'
import en from '@/locales/lessons/api.en.json'

// This route loads one lesson and its bilingual content.
export function Component () {
  return <Lesson resources={{ zh, en }} chapter='llm' number={4} previous='/llm/context' next='/llm/output' />
}
