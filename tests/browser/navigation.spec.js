import { expect, test } from '@playwright/test'

test.use({ viewport: { width: 390, height: 664 } })

test('Playground documentation panel uses one persistent Header toggle', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/playground.html')

  const toggle = page.locator('[data-playground-navigation-toggle]')
  const panel = page.locator('[data-playground-navigation-panel]')
  const menuIcon = toggle.locator('.site-header__menu-icon')
  const closeIcon = toggle.locator('.playground-navigation-toggle__close-icon')

  await expect(toggle).toBeVisible()
  await expect(toggle).toContainText('Navigation')
  await expect(toggle).toHaveAccessibleName('Open navigation')
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(menuIcon).toBeVisible()
  await expect(closeIcon).toBeHidden()
  await expect(panel).toBeHidden()

  await toggle.click()

  await expect(toggle).toBeVisible()
  await expect(toggle).toContainText('Navigation')
  await expect(toggle).toHaveAccessibleName('Close navigation')
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await expect(menuIcon).toBeHidden()
  await expect(closeIcon).toBeVisible()
  await expect(panel).toBeVisible()
  await expect(panel).toHaveAccessibleName('Documentation navigation panel')
  await expect(panel.locator('#playground-navigation-title')).toHaveCount(0)
  await expect(panel.locator('[data-playground-navigation-close]')).toHaveCount(0)
  await expect(panel.getByRole('link', { name: 'Introduction' })).toBeFocused()

  await toggle.click()

  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(toggle).toHaveAccessibleName('Open navigation')
  await expect(toggle).toBeFocused()
  await expect(menuIcon).toBeVisible()
  await expect(closeIcon).toBeHidden()
  await expect(panel).toBeHidden()

  await toggle.click()
  await page.keyboard.press('Escape')

  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(toggle).toBeFocused()
  await expect(menuIcon).toBeVisible()
  await expect(closeIcon).toBeHidden()
})

test('Playground exposes the intended Navigation control across responsive widths', async ({ page }) => {
  for (const width of [320, 390, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: width <= 390 ? 568 : 900 })
    await page.goto('/playground.html')

    const primaryToggle = page.locator('[data-navigation-toggle]')
    const documentationToggle = page.locator('[data-playground-navigation-toggle]')

    if (width <= 1024) {
      await expect(primaryToggle).toBeVisible()
      await expect(documentationToggle).toBeHidden()
    } else {
      await expect(primaryToggle).toBeHidden()
      await expect(documentationToggle).toBeVisible()
      await expect(documentationToggle).toContainText('Navigation')
    }

    await expect.poll(() => page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    )).toBe(true)
  }
})

test('landing responsive Navigation icon changes state without shifting its trigger', async ({ page }) => {
  for (const width of [320, 390, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: width <= 430 ? 568 : 900 })
    await page.goto('/')

    const toggle = page.locator('[data-navigation-toggle]')
    const navigation = page.locator('[data-navigation-menu]')
    const iconBars = toggle.locator('.site-header__menu-icon > span')

    if (width <= 1024) {
      await expect(toggle).toBeVisible()
      await expect(toggle).toHaveAttribute('aria-expanded', 'false')
      await expect(iconBars.nth(1)).toBeVisible()
      const closedBox = await toggle.boundingBox()

      await toggle.click()
      await expect(toggle).toHaveAttribute('aria-expanded', 'true')
      await expect(iconBars.nth(1)).toBeHidden()
      await expect(iconBars.first()).toHaveCSS('position', 'absolute')
      await expect(iconBars.last()).toHaveCSS('position', 'absolute')
      const openBox = await toggle.boundingBox()

      expect(openBox?.width).toBeCloseTo(closedBox?.width ?? 0, 1)
      expect(openBox?.height).toBeCloseTo(closedBox?.height ?? 0, 1)

      await toggle.click()
      await expect(iconBars.nth(1)).toBeVisible()
    } else {
      await expect(toggle).toBeHidden()
      await expect(navigation).toBeVisible()
    }

    await expect.poll(() => page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    )).toBe(true)
  }
})

test('landing mobile Navigation isolates the page and contains focus', async ({ page }) => {
  await page.goto('/')

  const navigation = page.locator('[data-navigation]')
  const toggle = page.locator('[data-navigation-toggle]')
  const icon = toggle.locator('.site-header__menu-icon')
  const iconBars = icon.locator('span')

  await expect(toggle).toBeVisible()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(toggle).toHaveAccessibleName('Open primary navigation')
  await expect(iconBars).toHaveCount(3)
  await expect(iconBars.nth(1)).toBeVisible()
  await expect(iconBars.first()).toHaveCSS('position', 'static')

  await toggle.focus()
  await page.keyboard.press('Enter')

  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await expect(toggle).toHaveAccessibleName('Close primary navigation')
  await expect(iconBars.nth(1)).toBeHidden()
  await expect(iconBars.first()).toHaveCSS('position', 'absolute')
  await expect(iconBars.last()).toHaveCSS('position', 'absolute')
  await expect(navigation).toHaveAttribute('data-navigation-open', '')
  await expect(page.locator('main')).toHaveJSProperty('inert', true)
  await expect(page.locator('html')).toHaveAttribute('data-navigation-scroll-lock', '')

  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(toggle).toHaveAccessibleName('Open primary navigation')
  await expect(toggle).toBeFocused()
  await expect(iconBars.nth(1)).toBeVisible()
  await expect(iconBars.first()).toHaveCSS('position', 'static')
  await expect(page.locator('main')).toHaveJSProperty('inert', false)
  await expect(page.locator('html')).not.toHaveAttribute('data-navigation-scroll-lock', '')

  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await expect(iconBars.nth(1)).toBeHidden()

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
  await expect(toggle).toHaveAccessibleName('Open primary navigation')
  await expect(toggle).toBeFocused()
  await expect(iconBars.nth(1)).toBeVisible()
  await expect(iconBars.first()).toHaveCSS('position', 'static')
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
