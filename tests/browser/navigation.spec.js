import { expect, test } from '@playwright/test'

test.use({ viewport: { width: 390, height: 664 } })

test('landing mobile Navigation isolates the page and contains focus', async ({ page }) => {
  await page.goto('/')

  const navigation = page.locator('[data-navigation]')
  const toggle = page.locator('[data-navigation-toggle]')

  await toggle.focus()
  await page.keyboard.press('Enter')

  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await expect(navigation).toHaveAttribute('data-navigation-open', '')
  await expect(page.locator('main')).toHaveJSProperty('inert', true)
  await expect(page.locator('html')).toHaveAttribute('data-navigation-scroll-lock', '')

  await navigation.evaluate((root) => {
    const focusables = [...root.querySelectorAll('a[href], button:not(:disabled)')]
      .filter((element) => element.getClientRects().length > 0)
    focusables.at(-1)?.focus()
  })
  await page.keyboard.press('Tab')
  await expect.poll(() => navigation.evaluate((root) => {
    const focusables = [...root.querySelectorAll('a[href], button:not(:disabled)')]
      .filter((element) => element.getClientRects().length > 0)
    return document.activeElement === focusables[0]
  })).toBe(true)

  await page.keyboard.press('Escape')
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(toggle).toBeFocused()
  await expect(page.locator('main')).toHaveJSProperty('inert', false)
  await expect(page.locator('html')).not.toHaveAttribute('data-navigation-scroll-lock', '')
})

test('opening a Modal transfers ownership from Navigation', async ({ page }) => {
  await page.goto('/playground.html#modals-title')

  const navigation = page.locator('[data-navigation]')
  const toggle = navigation.locator('[data-navigation-toggle]')
  const modal = page.locator('#basic-modal')
  const dialog = modal.locator('[data-modal-dialog]')

  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')

  await page.locator('[data-modal-open="basic-modal"]').evaluate((opener) => opener.click())

  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(navigation).not.toHaveAttribute('data-navigation-open', '')
  await expect(page.locator('html')).not.toHaveAttribute('data-navigation-scroll-lock', '')
  await expect(page.locator('html')).toHaveAttribute('data-modal-scroll-lock', '')
  await expect(modal).toBeVisible()
  await expect.poll(() => page.evaluate(() => {
    const active = document.activeElement
    return active instanceof Element && document.querySelector('#basic-modal [data-modal-dialog]')?.contains(active)
  })).toBe(true)

  await page.keyboard.press('Escape')
  await expect(modal).toBeHidden()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(page.locator('html')).not.toHaveAttribute('data-modal-scroll-lock', '')
  await expect(page.locator('main')).toHaveJSProperty('inert', false)
})
