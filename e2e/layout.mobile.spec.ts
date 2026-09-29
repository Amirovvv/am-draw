import { expect, test, type Locator } from '@playwright/test'

async function boxOf(locator: Locator): Promise<{ y: number; height: number }> {
  const box = await locator.boundingBox()
  if (!box) throw new Error('Element is not visible')
  return box
}

test.use({ locale: 'en-US' })

test('bottom navigation is pinned to the bottom and does not cover the content', async ({
  page,
}) => {
  await page.goto('/')
  const nav = page.getByRole('navigation', { name: 'Main navigation' })

  await expect(nav).toHaveCount(1)
  await expect(page.getByRole('banner').getByRole('navigation')).toHaveCount(0)
  const navBox = await boxOf(nav)
  expect(Math.round(navBox.y + navBox.height)).toBe(page.viewportSize()?.height)

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  const actionBox = await boxOf(page.getByRole('link', { name: 'Draw the first one' }))
  expect(actionBox.y + actionBox.height).toBeLessThanOrEqual((await boxOf(nav)).y)
})
