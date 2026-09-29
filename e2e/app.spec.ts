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

  test('has no horizontal scroll', async ({ page }) => {
    await page.goto('/')
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow).toBeLessThanOrEqual(0)
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

    await page.getByLabel('Language').selectOption('ru')
    await expect(page.getByRole('heading', { level: 1, name: 'Лента' })).toBeVisible()
    await expect(page).toHaveTitle('Лента · amdraw')

    await page.reload()
    await expect(page.getByRole('heading', { level: 1, name: 'Лента' })).toBeVisible()
    await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
  })
})
