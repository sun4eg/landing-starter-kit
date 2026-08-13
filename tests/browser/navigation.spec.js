import { expect, test } from '@playwright/test'

test.use({ viewport: { width: 390, height: 664 } })

async function getPlaygroundSideNavigation(page, width) {
  return width <= 1024
    ? {
        toggle: page.locator('[data-navigation-toggle]'),
        container: page.locator('[data-navigation-menu]'),
      }
    : {
        toggle: page.locator('[data-playground-navigation-toggle]'),
        container: page.locator('[data-playground-navigation-panel]'),
      }
}

async function expectCurrentLinkPositioned(page, container, targetHash) {
  const currentLink = container.locator(
    `[data-playground-navigation-link][href="${targetHash}"][aria-current="location"]`,
  )

  await expect(currentLink).toBeVisible()
  await expect.poll(() => container.evaluate((element, hash) => {
    const link = element.querySelector(
      `[data-playground-navigation-link][href="${hash}"][aria-current="location"]`,
    )

    if (!(link instanceof HTMLAnchorElement)) {
      return null
    }

    const containerRect = element.getBoundingClientRect()
    const linkRect = link.getBoundingClientRect()
    const maximumScrollPosition = Math.max(element.scrollHeight - element.clientHeight, 0)
    const linkCenter = linkRect.top - containerRect.top + element.scrollTop + (linkRect.height / 2)
    const expectedScrollPosition = Math.min(
      Math.max(linkCenter - (element.clientHeight / 2), 0),
      maximumScrollPosition,
    )

    return {
      fullyVisible: linkRect.top >= containerRect.top - 1 && linkRect.bottom <= containerRect.bottom + 1,
      centeredOrClamped: Math.abs(element.scrollTop - expectedScrollPosition) <= 2,
    }
  }, targetHash)).toEqual({ fullyVisible: true, centeredOrClamped: true })
}

async function settleCurrentSection(page, container, targetHash) {
  await page.evaluate((hash) => {
    const target = document.querySelector(hash)

    if (!(target instanceof HTMLElement)) {
      return
    }

    const measurement = document.createElement('div')
    measurement.style.position = 'absolute'
    measurement.style.visibility = 'hidden'
    measurement.style.blockSize = 'var(--scroll-offset)'
    document.body.append(measurement)
    const scrollOffset = measurement.getBoundingClientRect().height
    measurement.remove()

    const targetPosition = target.getBoundingClientRect().top + scrollY
    document.documentElement.style.scrollBehavior = 'auto'
    scrollTo({ top: Math.max(targetPosition - scrollOffset + 4, 0), behavior: 'auto' })
  }, targetHash)
  await expect(container.locator(`[href="${targetHash}"]`)).toHaveAttribute('aria-current', 'location')
}

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`Playground side Navigation centers its current item at ${width}px without moving the page`, async ({ page }) => {
    await page.setViewportSize({ width, height: 420 })
    await page.goto('/playground.html#timeline')

    const { toggle, container } = await getPlaygroundSideNavigation(page, width)
    await settleCurrentSection(page, container, '#timeline')
    const pageScrollPosition = await page.evaluate(() => scrollY)

    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(container).toBeVisible()

    await expectCurrentLinkPositioned(page, container, '#timeline')
    expect(Math.abs((await page.evaluate(() => scrollY)) - pageScrollPosition)).toBeLessThanOrEqual(1)

    if (width <= 1024) {
      await expect(toggle).toBeFocused()
    } else {
      await expect(container.getByRole('link', { name: 'Introduction' })).toBeFocused()
    }
  })
}

for (const width of [390, 1440]) {
  test(`Playground side Navigation clamps at its ends and follows current-item changes at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 420 })
    await page.goto('/playground.html#tokens-title')

    const { toggle, container } = await getPlaygroundSideNavigation(page, width)
    await settleCurrentSection(page, container, '#tokens-title')
    await toggle.evaluate((element) => element.click())
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expectCurrentLinkPositioned(page, container, '#tokens-title')
    await expect.poll(() => container.evaluate(
      (element) => Math.abs(element.scrollTop - (element.scrollHeight - element.clientHeight)) <= 2,
    )).toBe(true)

    await toggle.evaluate((element) => element.click())
    await page.evaluate(() => { location.hash = 'playground-title' })
    await settleCurrentSection(page, container, '#playground-title')
    await toggle.evaluate((element) => element.click())
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expectCurrentLinkPositioned(page, container, '#playground-title')
    await expect.poll(() => container.evaluate((element) => element.scrollTop <= 2)).toBe(true)
  })
}

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
