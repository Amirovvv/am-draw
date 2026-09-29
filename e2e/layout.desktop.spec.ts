import { expect, test } from '@playwright/test'

test.use({ locale: 'en-US' })

test('navigation lives in the header', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toHaveCount(1)
  await expect(page.getByRole('banner').getByRole('navigation')).toBeVisible()
})
