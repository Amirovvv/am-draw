import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'

import LocaleSwitcher from '@/app/components/LocaleSwitcher.vue'
import { i18n, setLocale } from '@/app/i18n'
import { LOCALE_STORAGE_KEY } from '@/app/i18n/locale'

describe('LocaleSwitcher', () => {
  beforeEach(() => {
    localStorage.clear()
    setLocale('en')
  })

  it('switches the locale, updates <html lang> and remembers the choice', async () => {
    const wrapper = mount(LocaleSwitcher, { global: { plugins: [i18n] } })

    await wrapper.get('input[value="ru"]').setValue(true)

    expect(i18n.global.locale.value).toBe('ru')
    expect(document.documentElement.lang).toBe('ru')
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('ru')
  })

  it('names every language by its own name and marks the current one', () => {
    const wrapper = mount(LocaleSwitcher, { global: { plugins: [i18n] } })

    const names = wrapper.findAll('label span.visually-hidden').map((name) => name.text())
    expect(names).toEqual(['Русский', 'English'])
    expect(wrapper.get<HTMLInputElement>('input[value="en"]').element.checked).toBe(true)
  })
})
