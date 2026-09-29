import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import IconButton from '@/shared/ui/IconButton.vue'

describe('IconButton', () => {
  it('exposes the label as the accessible name and hides the icon', () => {
    const wrapper = mount(IconButton, {
      props: { label: 'Undo' },
      slots: { default: '<svg />' },
    })

    expect(wrapper.get('button').attributes('aria-label')).toBe('Undo')
    expect(wrapper.get('.icon-button__icon').attributes('aria-hidden')).toBe('true')
  })

  it('reflects the toggle state only when `pressed` is set', () => {
    const plain = mount(IconButton, { props: { label: 'Undo' } })
    const toggle = mount(IconButton, { props: { label: 'Brush', pressed: true } })

    expect(plain.get('button').attributes('aria-pressed')).toBeUndefined()
    expect(toggle.get('button').attributes('aria-pressed')).toBe('true')
  })

  it('does not emit click when disabled', async () => {
    const wrapper = mount(IconButton, { props: { label: 'Undo', disabled: true } })

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('click')).toBeUndefined()
  })
})
