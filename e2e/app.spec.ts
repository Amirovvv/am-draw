import { expect, test, type Page } from '@playwright/test'

function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('pageerror', (error) => errors.push(error.message))
  return errors
}

test.describe('app shell', () => {
  test.use({ locale: 'en-US' })

  test('opens the feed without errors or CSP violations', async ({ page }) => {
    const errors = collectConsoleErrors(page)

    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1, name: 'Feed' })).toBeVisible()
    await expect(page).toHaveTitle('Feed · amdraw')
    expect(errors).toEqual([])
  })

  test('navigates between sections', async ({ page }) => {
    await page.goto('/')
    const nav = page.getByRole('navigation', { name: 'Main navigation' })

    await nav.getByRole('link', { name: 'Draw' }).click()
    await expect(page).toHaveURL('/draw')
    await expect(page.getByRole('heading', { level: 1, name: 'Draw' })).toBeVisible()

    await nav.getByRole('link', { name: 'Profile' }).click()
    await expect(page).toHaveURL('/profile')
    await expect(page.getByRole('heading', { level: 1, name: 'Profile' })).toBeVisible()
  })

  test('serves the SPA on deep links and shows 404 for unknown routes', async ({ page }) => {
    await page.goto('/draw')
    await expect(page.getByRole('heading', { level: 1, name: 'Draw' })).toBeVisible()

    await page.goto('/definitely/not/here')
    await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible()
    await page.getByRole('link', { name: 'Go home' }).click()
    await expect(page).toHaveURL('/')
  })

  for (const path of ['/', '/draw', '/profile', '/missing']) {
    test(`has no horizontal scroll on ${path}`, async ({ page }) => {
      await page.goto(path)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )
      expect(overflow).toBeLessThanOrEqual(0)
    })
  }

  test('loads self-hosted fonts under the CSP', async ({ page }) => {
    const errors = collectConsoleErrors(page)
    await page.goto('/')

    const loaded = await page.evaluate(async () => {
      await document.fonts.ready
      return {
        text: document.fonts.check('16px "Exo 2 Variable"', 'Лента Feed'),
        brand: document.fonts.check('16px Silkscreen', 'amdraw'),
      }
    })

    expect(loaded).toEqual({ text: true, brand: true })
    expect(errors).toEqual([])
  })
})

test.describe('layout', () => {
  test.use({ locale: 'en-US' })

  test('marks the current section in the navigation', async ({ page }) => {
    await page.goto('/draw')
    const nav = page.getByRole('navigation', { name: 'Main navigation' })

    await expect(nav.getByRole('link', { name: 'Draw' })).toHaveAttribute('aria-current', 'page')
    await expect(nav.getByRole('link', { name: 'Feed' })).not.toHaveAttribute('aria-current')
  })
})

test.describe('localization: Russian browser', () => {
  test.use({ locale: 'ru-RU' })

  test('detects Russian from the browser language', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1, name: 'Лента' })).toBeVisible()
    await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
  })
})

test.describe('localization: switching', () => {
  test.use({ locale: 'en-US' })

  test('switches language and remembers the choice after reload', async ({ page }) => {
    await page.goto('/')

    const switcher = page.getByTestId('locale-switcher')
    await switcher.locator('label').filter({ hasText: 'RU' }).click()
    await expect(switcher.getByRole('radio', { name: 'Русский' })).toBeChecked()
    await expect(page.getByRole('heading', { level: 1, name: 'Лента' })).toBeVisible()
    await expect(page).toHaveTitle('Лента · amdraw')

    await page.reload()
    await expect(page.getByRole('heading', { level: 1, name: 'Лента' })).toBeVisible()
    await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
  })
})
