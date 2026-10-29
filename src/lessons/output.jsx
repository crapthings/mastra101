import { Lesson } from './lesson'
import zh from '@/locales/lessons/output.zh.json'
import en from '@/locales/lessons/output.en.json'

// This route loads one lesson and its bilingual content.
export function Component () {
  return <Lesson resources={{ zh, en }} chapter='llm' number={5} previous='/llm/api' next='/llm/tools' />
}
