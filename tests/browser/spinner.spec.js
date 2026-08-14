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

      return {
        width: element.offsetWidth,
        height: element.offsetHeight,
        animationName: style.animationName,
        animationDuration: style.animationDuration,
        animationIterationCount: style.animationIterationCount,
        animationTimingFunction: style.animationTimingFunction,
        transformOrigin: style.transformOrigin,
        asymmetricCue: new Set([
          style.borderTopColor,
          style.borderRightColor,
          style.borderBottomColor,
          style.borderLeftColor,
        ]).size > 1,
      }
    }))

    for (const state of initialGeometry) {
      expect(state.animationName).toBe('spinner-rotate')
      expect(state.animationDuration).not.toBe('0s')
      expect(state.animationIterationCount).toBe('infinite')
      expect(state.animationTimingFunction).toBe('linear')
      expect(state.transformOrigin).not.toBe('0px 0px')
      expect(state.asymmetricCue).toBe(true)
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
})
