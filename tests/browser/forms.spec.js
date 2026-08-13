import { expect, test } from '@playwright/test'

test('all Playground demo forms preserve native validation and never navigate', async ({ page }) => {
  await page.goto('/playground.html#forms-title')

  const baseline = await page.evaluate(() => ({ href: location.href, historyLength: history.length }))
  const result = await page.evaluate(() => {
    const forms = [...document.querySelectorAll('form[data-playground-form-demo]')]
    const invalidResults = []
    const validResults = []

    for (const form of forms) {
      const requiredControls = [...form.elements].filter((control) =>
        (control instanceof HTMLInputElement || control instanceof HTMLSelectElement || control instanceof HTMLTextAreaElement) &&
        control.required &&
        !control.disabled,
      )

      for (const control of form.elements) {
        if (!(control instanceof HTMLInputElement || control instanceof HTMLSelectElement || control instanceof HTMLTextAreaElement)) continue
        if (!control.required || control.disabled) continue
        if (control.type === 'checkbox' || control.type === 'radio') control.checked = false
        else if (control.type !== 'file') control.value = ''
      }

      form.requestSubmit()
      invalidResults.push(requiredControls.length === 0 || !form.checkValidity())

      for (const control of form.elements) {
        if (!(control instanceof HTMLInputElement || control instanceof HTMLSelectElement || control instanceof HTMLTextAreaElement)) continue
        if (!control.required || control.disabled) continue
        if (control.type === 'checkbox' || control.type === 'radio') control.checked = true
        else if (control instanceof HTMLSelectElement) control.selectedIndex = Math.max(1, control.selectedIndex)
        else if (control.type === 'file') {
          const transfer = new DataTransfer()
          transfer.items.add(new File(['browser regression'], 'fixture.txt', { type: 'text/plain' }))
          control.files = transfer.files
        } else if (control.type === 'email') control.value = 'browser@example.com'
        else if (control.type === 'number' || control.type === 'range') control.value = control.min || '1'
        else if (control.type === 'date') control.value = control.min || '2026-08-12'
        else if (control.type === 'time') control.value = control.min || '12:00'
        else if (control.type === 'datetime-local') control.value = control.min || '2026-08-12T12:00'
        else control.value = 'Browser regression value'
      }

      const valid = form.checkValidity()
      if (valid) form.requestSubmit()
      validResults.push(valid)
    }

    return { count: forms.length, invalidResults, validResults }
  })

  expect(result.count).toBeGreaterThan(0)
  expect(result.invalidResults.every(Boolean)).toBe(true)
  expect(result.validResults.every(Boolean)).toBe(true)
  await expect.poll(() => page.evaluate(() => location.href)).toBe(baseline.href)
  expect(await page.evaluate(() => history.length)).toBe(baseline.historyLength)
})

test('textarea Enter inserts a newline without submitting', async ({ page }) => {
  await page.goto('/playground.html#forms-title')

  const textarea = page.locator('form[data-playground-form-demo] textarea').first()
  await textarea.fill('First line')
  await textarea.press('End')
  await textarea.press('Enter')
  await textarea.type('Second line')

  await expect(textarea).toHaveValue('First line\nSecond line')
  expect(new URL(page.url()).search).toBe('')
})

const floatingLabelWidths = [320, 390, 768, 1440]

for (const width of floatingLabelWidths) {
  test(`raised floating labels stay single-line and contained at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width <= 390 ? 568 : 900 })
    await page.goto('/playground.html#forms-title')

    const inactiveInput = page.locator('#playground-form-name')
    const inactiveLabel = page.locator('label[for="playground-form-name"]')
    await expect(inactiveInput).toHaveValue('')
    await expect(inactiveLabel).toHaveCSS('white-space', 'normal')

    const states = [
      {
        control: page.locator('#playground-form-organization'),
        label: page.locator('label[for="playground-form-organization"]'),
      },
      {
        control: page.locator('#playground-form-message'),
        label: page.locator('label[for="playground-form-message"]'),
      },
    ]

    await inactiveInput.focus()
    states.push({ control: inactiveInput, label: inactiveLabel })

    for (const { control, label } of states) {
      await expect(label).toHaveCSS('white-space', 'nowrap')
      const geometry = await label.evaluate((element) => {
        const field = element.closest('.form__field')
        const style = getComputedStyle(element)
        const labelRect = element.getBoundingClientRect()
        const fieldRect = field.getBoundingClientRect()
        const lineHeight = parseFloat(style.lineHeight)

        return {
          singleLine: labelRect.height <= lineHeight * 1.25,
          containedInline:
            labelRect.left >= fieldRect.left - 1 && labelRect.right <= fieldRect.right + 1,
        }
      })

      expect(geometry).toEqual({ singleLine: true, containedInline: true })
      await expect(control).toBeVisible()
    }

    await inactiveInput.blur()
    await page.getByRole('button', { name: 'Validate Playground form' }).click()
    await expect(inactiveInput).toBeFocused()
    expect(await inactiveInput.evaluate((control) => control.validity.valid)).toBe(false)
    await expect(inactiveLabel).toHaveCSS('white-space', 'nowrap')

    await expect.poll(() => page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    )).toBe(true)
  })
}

test('floating-label selectors retain focus, filled, textarea, and autofill states', async ({ page }) => {
  await page.goto('/playground.html#forms-title')

  const selectorCoverage = await page.evaluate(() => {
    const selectors = []

    for (const sheet of document.styleSheets) {
      for (const rule of sheet.cssRules) {
        if (rule instanceof CSSStyleRule && rule.selectorText?.includes('.form__label')) {
          selectors.push(rule.selectorText)
        }
      }
    }

    return selectors.join(' ')
  })

  expect(selectorCoverage).toContain(':focus')
  expect(selectorCoverage).toContain(':not(:placeholder-shown)')
  expect(selectorCoverage).toContain(':autofill')
  expect(selectorCoverage).toContain(':-webkit-autofill')
  expect(selectorCoverage).toContain('.form__textarea')
})
