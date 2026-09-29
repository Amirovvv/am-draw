import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import AppAvatar from '@/shared/ui/AppAvatar.vue'
import { AVATAR_TONES, getInitials, getTone } from '@/shared/ui/avatar'

describe('getInitials', () => {
  it.each([
    ['Ada Lovelace', 'AL'],
    ['мария иванова петрова', 'МП'],
    ['john_doe', 'JD'],
    ['solo', 'S'],
    ['  ', ''],
    ['👩‍🎨 artist', '👩‍🎨A'],
  ])('%s → %s', (name, expected) => {
    expect(getInitials(name)).toBe(expected)
  })
})

describe('getTone', () => {
  it('is stable and within the palette', () => {
    const tone = getTone('amdraw')

    expect(getTone('amdraw')).toBe(tone)
    expect(tone).toBeGreaterThanOrEqual(0)
    expect(tone).toBeLessThan(AVATAR_TONES)
  })
})

describe('AppAvatar', () => {
  it('shows the image and names the avatar for screen readers', () => {
    const wrapper = mount(AppAvatar, { props: { name: 'Ada', src: '/ada.webp' } })

    expect(wrapper.attributes('role')).toBe('img')
    expect(wrapper.attributes('aria-label')).toBe('Ada')
    expect(wrapper.get('img').attributes('alt')).toBe('')
  })

  it('falls back to initials when the image fails to load', async () => {
    const wrapper = mount(AppAvatar, { props: { name: 'Ada Lovelace', src: '/broken.webp' } })

    await wrapper.get('img').trigger('error')

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toBe('AL')
  })

  it('retries the image when the source changes', async () => {
    const wrapper = mount(AppAvatar, { props: { name: 'Ada', src: '/broken.webp' } })
    await wrapper.get('img').trigger('error')

    await wrapper.setProps({ src: '/ada.webp' })

    expect(wrapper.find('img').exists()).toBe(true)
  })
})
