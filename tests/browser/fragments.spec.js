import { expect, test } from '@playwright/test'

const viewports = [
  { width: 320, height: 568 },
  { width: 390, height: 664 },
  { width: 768, height: 900 },
  { width: 1440, height: 900 },
]

async function expectTargetBelowStickyHeader(page, targetSelector) {
  await expect.poll(() => page.evaluate(async (selector) => {
    await document.fonts.ready
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))

    const header = document.querySelector('[data-sticky-header]')
    const target = document.querySelector(selector)

    if (!(header instanceof HTMLElement) || !(target instanceof HTMLElement)) {
      return null
    }

    const headerBottom = header.getBoundingClientRect().bottom
    const targetTop = target.getBoundingClientRect().top
    const scrollOffset = parseFloat(getComputedStyle(target).scrollMarginBlockStart)

    return {
      clearsHeader: targetTop >= headerBottom + 1,
      excessiveOffset: targetTop - headerBottom > scrollOffset,
    }
  }, targetSelector), {
    message: `${targetSelector} should settle below the sticky Header without excessive offset`,
    timeout: 10_000,
  }).toEqual({ clearsHeader: true, excessiveOffset: false })
}

for (const viewport of viewports) {
  test(`nested fragment clears the sticky Header at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/playground.html#buttons-title')
    await page.evaluate(() => document.fonts.ready)

    await page.locator('a[href="#button-guidance-title"]').first().click()
    await expect(page).toHaveURL(/#button-guidance-title$/)
    await expectTargetBelowStickyHeader(page, '#button-guidance-title')
    await expect.poll(() => page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    )).toBe(true)
  })
}

test('direct nested fragment load and top-level fragment retain sticky clearance', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 568 })

  await page.goto('/playground.html#button-guidance-title')
  await expectTargetBelowStickyHeader(page, '#button-guidance-title')

  await page.goto('/playground.html#buttons-title')
  await expectTargetBelowStickyHeader(page, '#buttons-title')
})
