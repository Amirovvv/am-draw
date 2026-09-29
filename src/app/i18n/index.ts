import { createI18n } from 'vue-i18n'

import {
  detectLocale,
  readStoredLocale,
  storeLocale,
  DEFAULT_LOCALE,
  type Locale,
} from '@/app/i18n/locale'
import type { MessageSchema } from '@/app/i18n/messages'
import en from '@/app/i18n/messages/en'
import ru from '@/app/i18n/messages/ru'

declare module 'vue-i18n' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- augmentation for typed keys
  export interface DefineLocaleMessage extends MessageSchema {}
}

const initialLocale = detectLocale(readStoredLocale(), navigator.languages)

export const i18n = createI18n<[MessageSchema], Locale, false>({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: DEFAULT_LOCALE,
  messages: { ru, en },
})

document.documentElement.lang = initialLocale

export function setLocale(locale: Locale): void {
  i18n.global.locale.value = locale
  document.documentElement.lang = locale
  storeLocale(locale)
}
