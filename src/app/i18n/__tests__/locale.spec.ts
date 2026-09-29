import { describe, expect, it } from 'vitest'

import { detectLocale, isLocale } from '@/app/i18n/locale'

describe('isLocale', () => {
  it('accepts supported locales only', () => {
    expect(isLocale('ru')).toBe(true)
    expect(isLocale('en')).toBe(true)
    expect(isLocale('de')).toBe(false)
    expect(isLocale(null)).toBe(false)
  })
})

describe('detectLocale', () => {
  it('prefers a valid stored choice over browser languages', () => {
    expect(detectLocale('en', ['ru-RU'])).toBe('en')
  })

  it('ignores an invalid stored value', () => {
    expect(detectLocale('xx', ['ru-RU'])).toBe('ru')
  })

  it('maps regional tags to the base language', () => {
    expect(detectLocale(null, ['en-GB'])).toBe('en')
    expect(detectLocale(null, ['RU-ru'])).toBe('ru')
  })

  it('uses Russian for languages whose speakers usually read it', () => {
    expect(detectLocale(null, ['uk-UA'])).toBe('ru')
    expect(detectLocale(null, ['kk'])).toBe('ru')
  })

  it('respects language priority order', () => {
    expect(detectLocale(null, ['de-DE', 'en-US', 'ru-RU'])).toBe('en')
    expect(detectLocale(null, ['de-DE', 'ru-RU', 'en-US'])).toBe('ru')
  })

  it('falls back to English', () => {
    expect(detectLocale(null, ['de-DE', 'fr'])).toBe('en')
    expect(detectLocale(null, [])).toBe('en')
  })
})
