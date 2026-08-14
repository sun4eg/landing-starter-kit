import { expect, test } from '@playwright/test'

const widths = [320, 390, 768, 1440]
const sizeSpinners = '.playground-demo-group[aria-labelledby="spinner-sizes-title"] .spinner__visual'

async function expectTransformsToAdvance(spinners) {
  const initialTransforms = await spinners.evaluateAll((elements) =>
    elements.map((element) => getComputedStyle(element).transform),
  )

  await expect.poll(() => spinners.evaluateAll((elements) =>
    elements.map((element) => getComputedStyle(element).transform),
  )).not.toEqual(initialTransforms)
}

test('Spinner continuously rotates at every size when motion is allowed', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })

  for (const width of widths) {
    await page.setViewportSize({ width, height: width <= 390 ? 568 : 900 })
    await page.goto('/playground.html#spinners-title')
    await expect.poll(() => page.evaluate(
      () => matchMedia('(prefers-reduced-motion: reduce)').matches,
    )).toBe(false)

    const spinners = page.locator(sizeSpinners)
    await expect(spinners).toHaveCount(3)

    const initialGeometry = await spinners.evaluateAll((elements) => elements.map((element) => {
      const style = getComputedStyle(element)
      const before = getComputedStyle(element, '::before')
      const after = getComputedStyle(element, '::after')

      return {
        width: element.offsetWidth,
        height: element.offsetHeight,
        animationName: style.animationName,
        animationDuration: style.animationDuration,
        animationIterationCount: style.animationIterationCount,
        animationTimingFunction: style.animationTimingFunction,
        transformOrigin: style.transformOrigin,
        borderColors: [
          style.borderTopColor,
          style.borderRightColor,
          style.borderBottomColor,
          style.borderLeftColor,
        ],
        borderWidths: [
          style.borderTopWidth,
          style.borderRightWidth,
          style.borderBottomWidth,
          style.borderLeftWidth,
        ],
        caps: [before, after].map((cap) => ({
          content: cap.content,
          width: Number.parseFloat(cap.width),
          height: Number.parseFloat(cap.height),
          radius: cap.borderRadius,
          color: cap.backgroundColor,
          top: cap.top,
          right: cap.right,
          bottom: cap.bottom,
          left: cap.left,
        })),
      }
    }))

    for (const state of initialGeometry) {
      expect(state.animationName).toBe('spinner-rotate')
      expect(state.animationDuration).not.toBe('0s')
      expect(state.animationIterationCount).toBe('infinite')
      expect(state.animationTimingFunction).toBe('linear')
      expect(state.transformOrigin).not.toBe('0px 0px')
      const [strongTop, ghostRight, ghostBottom, strongLeft] = state.borderColors
      expect(strongTop).toBe(strongLeft)
      expect(ghostRight).toBe(ghostBottom)
      expect(strongTop).not.toBe(ghostRight)
      expect(new Set(state.borderWidths).size).toBe(1)
      const borderWidth = Number.parseFloat(state.borderWidths[0])

      for (const cap of state.caps) {
        expect(cap.content).not.toBe('none')
        expect(cap.width).toBeGreaterThan(0)
        expect(cap.width).toBe(cap.height)
        expect(cap.width).toBe(borderWidth)
        expect(cap.radius).not.toBe('0px')
        expect(cap.color).toBe(strongTop)
      }

      expect(Number.parseFloat(state.caps[0].top)).toBe(0)
      expect(Number.parseFloat(state.caps[0].right)).toBe(0)
      expect(Number.parseFloat(state.caps[1].bottom)).toBe(0)
      expect(Number.parseFloat(state.caps[1].left)).toBe(0)
    }

    await expectTransformsToAdvance(spinners)

    const finalGeometry = await spinners.evaluateAll((elements) => elements.map((element) => ({
      width: element.offsetWidth,
      height: element.offsetHeight,
    })))

    expect(finalGeometry).toEqual(initialGeometry.map(({ width: spinnerWidth, height }) => ({
      width: spinnerWidth,
      height,
    })))
    await expect.poll(() => page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    )).toBe(true)
  }
})

test('Spinner is intentionally static and visible with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/playground.html#spinners-title')

  const spinners = page.locator(sizeSpinners)
  await expect.poll(() => page.evaluate(
    () => matchMedia('(prefers-reduced-motion: reduce)').matches,
  )).toBe(true)

  for (const spinner of await spinners.all()) {
    await expect(spinner).toBeVisible()
    await expect(spinner).toHaveCSS('animation-name', 'none')
    await expect(spinner).toHaveCSS('transform', 'none')
  }

  const staticStates = await spinners.evaluateAll((elements) => elements.map((element) => ({
    borderColors: [
      getComputedStyle(element).borderTopColor,
      getComputedStyle(element).borderRightColor,
      getComputedStyle(element).borderBottomColor,
      getComputedStyle(element).borderLeftColor,
    ],
    beforeContent: getComputedStyle(element, '::before').content,
    afterContent: getComputedStyle(element, '::after').content,
  })))

  for (const state of staticStates) {
    expect(new Set(state.borderColors).size).toBe(1)
    expect(state.beforeContent).toBe('none')
    expect(state.afterContent).toBe('none')
  }
})
