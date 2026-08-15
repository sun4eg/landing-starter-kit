import { expect, test } from '@playwright/test'

const widths = [320, 390, 430, 768, 1024, 1440]

for (const width of widths) {
  for (const path of ['/', '/playground.html']) {
    test(`${path} has no page-level overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: width <= 390 ? 664 : 900 })
      await page.goto(path)

      await expect.poll(() => page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      )).toBe(true)
    })
  }
}

test('Progress Card stays intrinsic and before the following subsection', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 664 })
  await page.goto('/playground.html#progress-card-title')

  const geometry = await page.evaluate(() => {
    const heading = document.querySelector('#progress-card-title')
    const group = heading.closest('.playground-demo-group')
    const card = group.querySelector('.service-card')
    const grid = card.parentElement
    const nextGroup = document.querySelector('#progress-resilience-title').closest('.playground-demo-group')
    const cardRect = card.getBoundingClientRect()
    const gridRect = grid.getBoundingClientRect()
    const nextRect = nextGroup.getBoundingClientRect()

    function declarationsFor(selector) {
      const declarations = []
      const visit = (rules) => {
        for (const rule of rules) {
          if (rule instanceof CSSStyleRule && rule.selectorText.split(',').map((value) => value.trim()).includes(selector)) {
            declarations.push(rule.style.height || rule.style.blockSize)
          } else if ('cssRules' in rule) {
            visit(rule.cssRules)
          }
        }
      }
      for (const sheet of document.styleSheets) visit(sheet.cssRules)
      return declarations.filter(Boolean)
    }

    return {
      cardHeight: cardRect.height,
      gridHeight: gridRect.height,
      gapToNext: nextRect.top - cardRect.bottom,
      nextOutsideCard: !card.contains(nextGroup),
      explicitBlockSizes: declarationsFor('.service-card'),
    }
  })

  expect(geometry.explicitBlockSizes).toEqual([])
  expect(geometry.nextOutsideCard).toBe(true)
  expect(geometry.gapToNext).toBeGreaterThan(0)
  expect(geometry.cardHeight).toBeLessThan(600)
  expect(Math.abs(geometry.cardHeight - geometry.gridHeight)).toBeLessThan(2)
})

test('landing Services Grid retains equal-height Cards within each row', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')

  const heights = await page.locator('.services__grid > .service-card').evaluateAll((cards) =>
    cards.map((card) => card.getBoundingClientRect().height),
  )

  expect(heights).toHaveLength(6)
  expect(Math.max(...heights) - Math.min(...heights)).toBeLessThan(2)
})

test('Button centers its Spinner without changing standalone Spinner alignment', async ({ page }) => {
  const results = []

  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: width <= 390 ? 664 : 900 })
    await page.goto('/playground.html#spinner-composition-title')
    await page.evaluate(() => document.fonts.ready)

    const button = page.locator('#spinner-composition-title').locator('..').locator('..').getByRole('button')
    await expect(button).toHaveAccessibleName('Saving…')
    await expect(button.locator('.spinner')).toHaveAttribute('aria-hidden', 'true')

    results.push(await page.evaluate(() => {
      const heading = document.querySelector('#spinner-composition-title')
      const group = heading.closest('.playground-demo-group')
      const button = group.querySelector('.button')
      const buttonSpinner = button.querySelector('.spinner__visual')
      const standaloneSpinner = document.querySelector('.spinner--small[role="status"] .spinner__visual')
      const labelNode = [...button.childNodes].find(
        (node) => node.nodeType === Node.TEXT_NODE && node.textContent.includes('Saving'),
      )
      const labelRange = document.createRange()
      labelRange.selectNode(labelNode)

      const buttonRect = button.getBoundingClientRect()
      const spinnerRect = buttonSpinner.getBoundingClientRect()
      const labelRect = labelRange.getBoundingClientRect()
      const standaloneRect = standaloneSpinner.getBoundingClientRect()

      return {
        buttonHeight: buttonRect.height,
        contentGap: parseFloat(getComputedStyle(button).columnGap),
        centerDifference: Math.abs(
          (spinnerRect.top + spinnerRect.height / 2) - (labelRect.top + labelRect.height / 2),
        ),
        buttonSpinnerHeight: spinnerRect.height,
        buttonSpinnerWidth: spinnerRect.width,
        standaloneSpinnerHeight: standaloneRect.height,
        standaloneSpinnerWidth: standaloneRect.width,
        buttonMarginBlockStart: parseFloat(getComputedStyle(buttonSpinner).marginBlockStart),
        standaloneMarginBlockStart: parseFloat(getComputedStyle(standaloneSpinner).marginBlockStart),
        overflows: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      }
    }))
  }

  for (const result of results) {
    expect(result.centerDifference).toBeLessThanOrEqual(1)
    expect(result.buttonMarginBlockStart).toBe(0)
    expect(result.standaloneMarginBlockStart).toBeGreaterThan(0)
    expect(Math.abs(result.buttonSpinnerWidth - result.standaloneSpinnerWidth)).toBeLessThan(1)
    expect(Math.abs(result.buttonSpinnerHeight - result.standaloneSpinnerHeight)).toBeLessThan(1)
    expect(result.overflows).toBe(false)
  }

  expect(
    Math.max(...results.map(({ buttonHeight }) => buttonHeight))
      - Math.min(...results.map(({ buttonHeight }) => buttonHeight)),
  ).toBeLessThan(1)
  expect(Math.min(...results.map(({ contentGap }) => contentGap))).toBeGreaterThan(0)
  expect(
    Math.max(...results.map(({ contentGap }) => contentGap))
      - Math.min(...results.map(({ contentGap }) => contentGap)),
  ).toBeLessThan(1)
})
