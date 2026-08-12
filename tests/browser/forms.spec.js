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
