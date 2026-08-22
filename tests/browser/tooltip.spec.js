import { expect, test } from '@playwright/test'

const saveTrigger = '#tooltip-save-trigger'
const saveContent = '#tooltip-save-content'

async function openWithKeyboard(page, triggerSelector = saveTrigger, contentSelector = saveContent) {
  const trigger = page.locator(triggerSelector)
  const content = page.locator(contentSelector)

  await trigger.focus()
  await expect(trigger).toBeFocused()
  await expect(content).toBeVisible()
  return { trigger, content }
}

test.beforeEach(async ({ page }) => {
  await page.goto('/playground.html#tooltips-title')
})

test('valid authored Tooltips enhance without changing semantic relationships', async ({ page }) => {
  const roots = page.locator('[data-tooltip]')

  await expect(roots).toHaveCount(4)

  for (const root of await roots.all()) {
    const trigger = root.locator('[data-tooltip-trigger]')
    const content = root.locator('[data-tooltip-content]')
    const contentId = await content.getAttribute('id')

    expect(contentId).toBeTruthy()
    await expect(root).toHaveAttribute('data-tooltip-enhanced', '')
    await expect(content).toHaveRole('tooltip')
    await expect(content).toBeHidden()
    await expect(trigger).toHaveAttribute('aria-describedby', new RegExp(`(^|\\s)${contentId}(\\s|$)`))
    await expect(trigger).not.toHaveAttribute('aria-expanded')
    await expect(trigger).not.toHaveAttribute('aria-haspopup')
    await expect(content.locator('a, button, input, select, textarea, [tabindex]')).toHaveCount(0)
  }

  await expect(page.locator(saveTrigger)).toHaveAccessibleName('Save draft')
})

test('keyboard focus opens immediately, Escape suppresses reopening until disengagement', async ({ page }) => {
  const { trigger, content } = await openWithKeyboard(page)

  await page.keyboard.press('Escape')
  await expect(content).toBeHidden()
  await expect(trigger).toBeFocused()

  await trigger.dispatchEvent('focus')
  await expect(content).toBeHidden()

  await page.locator('#tooltip-link-trigger').focus()
  await trigger.focus()
  await expect(content).toBeVisible()

  await page.locator('#tooltip-link-trigger').focus()
  await expect(content).toBeHidden()
})

test('fine-pointer delay, hover bridge, and pointer exit follow the timing contract', async ({ page }) => {
  await page.goto('/playground.html')
  const trigger = page.locator(saveTrigger)
  const content = page.locator(saveContent)

  await page.mouse.move(1, 1)
  await page.evaluate(({ triggerSelector, contentSelector }) => {
    const trigger = document.querySelector(triggerSelector)
    const content = document.querySelector(contentSelector)
    const timing = {}

    window.__tooltipTiming = timing
    trigger.addEventListener('pointerenter', () => { timing.triggerEntered = performance.now() }, { once: true })
    content.addEventListener('pointerenter', () => { timing.contentEntered = performance.now() }, { once: true })
    content.addEventListener('pointerleave', () => { timing.contentLeft = performance.now() }, { once: true })

    new MutationObserver(() => {
      if (content.hidden) {
        timing.closed = performance.now()
      } else {
        timing.opened = performance.now()
      }
    }).observe(content, { attributes: true, attributeFilter: ['hidden'] })
  }, { triggerSelector: saveTrigger, contentSelector: saveContent })

  await trigger.hover()
  await expect(content).toBeVisible({ timeout: 2_000 })

  const openDelay = await page.evaluate(
    () => window.__tooltipTiming.opened - window.__tooltipTiming.triggerEntered,
  )
  expect(openDelay).toBeGreaterThanOrEqual(300)

  const contentBox = await content.boundingBox()
  expect(contentBox).not.toBeNull()
  await page.mouse.move(contentBox.x + contentBox.width / 2, contentBox.y + contentBox.height / 2)
  await expect.poll(() => page.evaluate(() => {
    const { contentEntered } = window.__tooltipTiming
    return contentEntered === undefined ? 0 : performance.now() - contentEntered
  })).toBeGreaterThanOrEqual(150)
  await expect(content).toBeVisible()

  await page.mouse.move(1, 1)
  await expect(content).toBeHidden({ timeout: 1_500 })

  const closeDelay = await page.evaluate(
    () => window.__tooltipTiming.closed - window.__tooltipTiming.contentLeft,
  )
  expect(closeDelay).toBeGreaterThanOrEqual(75)
})

test('activation and outside pointerdown close without blocking trigger behavior', async ({ page }) => {
  const trigger = page.locator(saveTrigger)
  const content = page.locator(saveContent)

  await trigger.evaluate((element) => {
    element.dataset.activationCount = '0'
    element.addEventListener('click', () => {
      element.dataset.activationCount = String(Number(element.dataset.activationCount) + 1)
    })
  })

  await trigger.hover()
  await expect(content).toBeVisible()
  await trigger.click()
  await expect(content).toBeHidden()
  await expect(trigger).toHaveAttribute('data-activation-count', '1')

  await page.mouse.move(1, 1)
  await page.locator('#tooltip-link-trigger').focus()
  await page.keyboard.press('Shift+Tab')
  await expect(trigger).toBeFocused()
  await expect(content).toBeVisible()
  await page.locator('#tooltip-examples-title').click()
  await expect(content).toBeHidden()
})

test('only one Tooltip is visible and disconnected active instances clean up safely', async ({ page }) => {
  const saveTriggerLocator = page.locator(saveTrigger)
  const saveContentLocator = page.locator(saveContent)
  const linkTrigger = page.locator('#tooltip-link-trigger')
  const linkContent = page.locator('#tooltip-link-content')

  await saveTriggerLocator.hover()
  await expect(saveContentLocator).toBeVisible()
  await linkTrigger.hover()
  await expect(linkContent).toBeVisible()
  await expect(saveContentLocator).toBeHidden()

  await linkTrigger.evaluate((trigger) => trigger.closest('[data-tooltip]').remove())
  await expect(linkContent).toHaveCount(0)

  await page.mouse.move(1, 1)
  await saveTriggerLocator.focus()
  await expect(saveContentLocator).toBeVisible()
})

test('automatic placement prefers block-start, falls back, clamps, and preserves page scroll', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 664 })
  const trigger = page.locator('#tooltip-edge-trigger')
  const content = page.locator('#tooltip-edge-content')

  await trigger.evaluate((element) => {
    const root = element.closest('[data-tooltip]')
    Object.assign(root.style, {
      position: 'fixed',
      top: '300px',
      right: '0',
      zIndex: '1',
    })
  })
  const focusScroll = await trigger.evaluate((element) => {
    const before = { x: scrollX, y: scrollY }
    element.focus({ preventScroll: true })
    return { before, after: { x: scrollX, y: scrollY } }
  })
  await expect(content).toBeVisible()

  const centered = await page.evaluate(() => {
    const triggerRect = document.querySelector('#tooltip-edge-trigger').getBoundingClientRect()
    const contentRect = document.querySelector('#tooltip-edge-content').getBoundingClientRect()
    const viewport = window.visualViewport
    const left = viewport?.offsetLeft ?? 0
    const top = viewport?.offsetTop ?? 0
    const right = left + (viewport?.width ?? innerWidth)
    const bottom = top + (viewport?.height ?? innerHeight)

    return {
      triggerTop: triggerRect.top,
      contentBottom: contentRect.bottom,
      contentLeft: contentRect.left,
      contentRight: contentRect.right,
      viewport: { left, top, right, bottom },
      position: document.querySelector('#tooltip-edge-content').dataset.tooltipPosition,
      scroll: { x: scrollX, y: scrollY },
      overflows: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    }
  })

  expect(centered.position).toBe('block-start')
  expect(centered.contentBottom).toBeLessThanOrEqual(centered.triggerTop)
  expect(centered.contentLeft).toBeGreaterThanOrEqual(centered.viewport.left)
  expect(centered.contentRight).toBeLessThanOrEqual(centered.viewport.right)
  expect(focusScroll.after).toEqual(focusScroll.before)
  expect(centered.overflows).toBe(false)

  await page.keyboard.press('Escape')
  await trigger.evaluate((element) => {
    element.closest('[data-tooltip]').style.top = '4px'
  })
  await page.locator('#tooltip-save-trigger').focus()
  await trigger.focus()
  await expect(content).toBeVisible()

  const flipped = await page.evaluate(() => {
    const triggerRect = document.querySelector('#tooltip-edge-trigger').getBoundingClientRect()
    const contentRect = document.querySelector('#tooltip-edge-content').getBoundingClientRect()
    return {
      position: document.querySelector('#tooltip-edge-content').dataset.tooltipPosition,
      triggerBottom: triggerRect.bottom,
      contentTop: contentRect.top,
    }
  })

  expect(flipped.position).toBe('block-end')
  expect(flipped.contentTop).toBeGreaterThanOrEqual(flipped.triggerBottom)
})

test('open Tooltip repositions after scrolling and resizing without page overflow', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 700 })
  const trigger = page.locator('#tooltip-wrap-trigger')
  const content = page.locator('#tooltip-wrap-content')
  await trigger.evaluate((element) => {
    const root = element.closest('[data-tooltip]')
    Object.assign(root.style, {
      position: 'fixed',
      top: '350px',
      left: '200px',
      zIndex: '1',
    })
  })
  await trigger.evaluate((element) => element.focus({ preventScroll: true }))
  await expect(content).toBeVisible()
  const before = await content.boundingBox()
  await trigger.evaluate((element) => {
    element.closest('[data-tooltip]').style.top = '200px'
    window.dispatchEvent(new Event('scroll'))
  })
  await expect.poll(async () => (await content.boundingBox())?.y).not.toBe(before.y)

  await page.setViewportSize({ width: 320, height: 420 })
  await expect.poll(() => page.evaluate(() => {
    const rect = document.querySelector('#tooltip-wrap-content').getBoundingClientRect()
    const viewport = window.visualViewport
    const left = viewport?.offsetLeft ?? 0
    const top = viewport?.offsetTop ?? 0
    const right = left + (viewport?.width ?? innerWidth)
    const bottom = top + (viewport?.height ?? innerHeight)
    return rect.left >= left && rect.right <= right && rect.top >= top && rect.bottom <= bottom
  })).toBe(true)

  await expect.poll(() => page.evaluate(
    () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
  )).toBe(true)
})

test('responsive and RTL geometry remains viewport-contained', async ({ page }) => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: width <= 390 ? 420 : 700 })
    await page.goto('/playground.html#tooltips-title')
    await page.locator('#tooltip-wrap-trigger').evaluate((element) => element.scrollIntoView({ block: 'center' }))
    await page.locator('#tooltip-wrap-trigger').focus()
    await expect(page.locator('#tooltip-wrap-content')).toBeVisible()

    const geometry = await page.locator('#tooltip-wrap-content').evaluate((content) => {
      const rect = content.getBoundingClientRect()
      return {
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
        width: rect.width,
        viewportWidth: innerWidth,
        viewportHeight: innerHeight,
        overflows: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      }
    })

    expect(geometry.left).toBeGreaterThanOrEqual(0)
    expect(geometry.right).toBeLessThanOrEqual(geometry.viewportWidth)
    expect(geometry.top).toBeGreaterThanOrEqual(0)
    expect(geometry.bottom).toBeLessThanOrEqual(geometry.viewportHeight)
    expect(geometry.width).toBeLessThan(geometry.viewportWidth)
    expect(geometry.overflows).toBe(false)
  }

  await page.setViewportSize({ width: 390, height: 664 })
  await page.goto('/playground.html#tooltips-title')
  await page.locator('html').evaluate((element) => { element.dir = 'rtl' })
  await page.locator('#tooltip-edge-trigger').focus()
  await expect(page.locator('#tooltip-edge-content')).toBeVisible()
  await expect.poll(() => page.locator('#tooltip-edge-content').evaluate((content) => {
    const rect = content.getBoundingClientRect()
    return rect.left >= 0 && rect.right <= innerWidth
  })).toBe(true)
})

test('touch-like pointer input does not visually open Tooltip or block activation', async ({ page }) => {
  const trigger = page.locator(saveTrigger)
  const content = page.locator(saveContent)

  await trigger.evaluate((element) => {
    element.dataset.activationCount = '0'
    element.addEventListener('click', () => {
      element.dataset.activationCount = String(Number(element.dataset.activationCount) + 1)
    })
  })
  await trigger.dispatchEvent('pointerenter', { pointerType: 'touch' })
  await page.evaluate(() => new Promise((resolve) => window.setTimeout(resolve, 450)))
  await trigger.evaluate((element) => element.click())
  await expect(trigger).toHaveAttribute('data-activation-count', '1')
  await expect(content).toBeHidden()
})

test('invalid authored instance stays hidden while valid instances still enhance', async ({ browser }) => {
  const context = await browser.newContext()
  await context.route('**/playground.html', async (route) => {
    const response = await route.fetch()
    const body = (await response.text()).replace(
      /(<span\s+class="tooltip__content"\s+id="tooltip-edge-content"\s+)role="tooltip"/,
      '$1role="note"',
    )
    await route.fulfill({ response, body })
  })
  const page = await context.newPage()
  await page.goto('/playground.html#tooltips-title')

  const invalidRoot = page.locator('#tooltip-edge-trigger').locator('..')
  await expect(invalidRoot).not.toHaveAttribute('data-tooltip-enhanced')
  await expect(page.locator('#tooltip-edge-content')).toBeHidden()
  await expect(page.locator(saveTrigger).locator('..')).toHaveAttribute('data-tooltip-enhanced', '')
  await context.close()
})
