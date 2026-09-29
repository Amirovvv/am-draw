import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import { i18n } from '@/app/i18n'
import AppButton from '@/shared/ui/AppButton.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', name: 'feed', component: { render: () => null } }],
})

function mountButton(props: InstanceType<typeof AppButton>['$props'] = {}) {
  return mount(AppButton, {
    props,
    slots: { default: 'Publish' },
    global: { plugins: [i18n, router] },
  })
}

describe('AppButton', () => {
  it('renders a button with type="button" by default and emits click', async () => {
    const wrapper = mountButton()

    const button = wrapper.get('button')
    expect(button.attributes('type')).toBe('button')
    await button.trigger('click')

    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('is disabled and silent while loading, and announces progress', async () => {
    const wrapper = mountButton({ loading: true })

    const button = wrapper.get('button')
    expect(button.attributes('disabled')).toBeDefined()
    expect(button.attributes('aria-busy')).toBe('true')
    expect(wrapper.find('[role="status"]').exists()).toBe(true)
    await button.trigger('click')

    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('renders a router link when `to` is given', () => {
    const wrapper = mountButton({ to: { name: 'feed' } })

    expect(wrapper.get('a').attributes('href')).toBe('/')
  })

  it('renders a safe external link when `href` is given', () => {
    const wrapper = mountButton({ href: 'https://example.com' })

    const link = wrapper.get('a')
    expect(link.attributes('href')).toBe('https://example.com')
    expect(link.attributes('rel')).toBe('noopener noreferrer')
  })

  it('drops the destination of a disabled link', async () => {
    const wrapper = mountButton({ to: { name: 'feed' }, disabled: true })

    const link = wrapper.get('a')
    expect(link.attributes('href')).toBeUndefined()
    expect(link.attributes('aria-disabled')).toBe('true')
    await link.trigger('click')

    expect(wrapper.emitted('click')).toBeUndefined()
  })
})
