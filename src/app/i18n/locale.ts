export const SUPPORTED_LOCALES = ['ru', 'en'] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'
export const LOCALE_STORAGE_KEY = 'amdraw:locale'

// Speakers of these languages usually read Russian better than English.
const RUSSIAN_READING_LANGUAGES = new Set(['ru', 'uk', 'be', 'kk', 'ky', 'uz', 'tg', 'hy', 'az'])

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (SUPPORTED_LOCALES as readonly string[]).includes(value)
}

export function detectLocale(stored: string | null, languages: readonly string[]): Locale {
  if (isLocale(stored)) return stored

  for (const tag of languages) {
    const language = tag.toLowerCase().split('-')[0] ?? ''
    if (language === 'en') return 'en'
    if (RUSSIAN_READING_LANGUAGES.has(language)) return 'ru'
  }

  return DEFAULT_LOCALE
}

export function readStoredLocale(): string | null {
  try {
    return localStorage.getItem(LOCALE_STORAGE_KEY)
  } catch {
    // Storage can be unavailable (private mode, blocked cookies in in-app browsers).
    return null
  }
}

export function storeLocale(locale: Locale): void {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  } catch {
    // Not critical: the locale will be detected again on the next visit.
  }
}
