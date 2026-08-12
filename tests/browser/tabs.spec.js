import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/playground.html#tabs')
})

test('automatic horizontal Tabs support arrows, Home, and End', async ({ page }) => {
  const overview = page.locator('#workspace-tab-overview')
  const activity = page.locator('#workspace-tab-activity')
  const access = page.locator('#workspace-tab-access')

  await overview.focus()
  await page.keyboard.press('ArrowRight')
  await expect(activity).toBeFocused()
  await expect(activity).toHaveAttribute('aria-selected', 'true')
  await expect(activity).toHaveAttribute('tabindex', '0')
  await expect(page.locator('#workspace-panel-activity')).toBeVisible()

  await page.keyboard.press('End')
  await expect(access).toBeFocused()
  await expect(access).toHaveAttribute('aria-selected', 'true')
  await page.keyboard.press('Home')
  await expect(overview).toBeFocused()
  await expect(overview).toHaveAttribute('aria-selected', 'true')
})

test('manual and vertical Tabs preserve their activation contracts', async ({ page }) => {
  const saved = page.locator('#reports-tab-saved')
  const shared = page.locator('#reports-tab-shared')
  await saved.focus()
  await page.keyboard.press('ArrowRight')
  await expect(shared).toBeFocused()
  await expect(shared).toHaveAttribute('aria-selected', 'false')
  await expect(page.locator('#reports-panel-saved')).toBeVisible()
  await page.keyboard.press('Enter')
  await expect(shared).toHaveAttribute('aria-selected', 'true')
  await expect(shared).toHaveAttribute('tabindex', '0')
  await expect(page.locator('#reports-panel-shared')).toBeVisible()

  const profile = page.locator('#settings-tab-profile')
  const security = page.locator('#settings-tab-security')
  await profile.focus()
  await page.keyboard.press('ArrowDown')
  await expect(security).toBeFocused()
  await expect(security).toHaveAttribute('aria-selected', 'true')
  await expect(page.locator('#settings-panel-security')).toBeVisible()
})
