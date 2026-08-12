import { expect, test } from '@playwright/test'

test('Modal isolates background, traps focus, and restores its opener', async ({ page }) => {
  await page.goto('/playground.html#modals-title')

  const opener = page.locator('[data-modal-open="basic-modal"]')
  const modal = page.locator('#basic-modal')
  const dialog = modal.locator('[data-modal-dialog]')
  const closeButton = modal.locator('[data-modal-close]').first()

  await opener.click()
  await expect(modal).toBeVisible()
  await expect(page.locator('body > .site-header')).toHaveJSProperty('inert', true)
  await expect(page.locator('html')).toHaveAttribute('data-modal-scroll-lock', '')
  await expect(closeButton).toBeFocused()

  const dialogFocusables = dialog.locator('a[href], button:not(:disabled), input:not(:disabled)')
  const focusableCount = await dialogFocusables.count()
  await dialogFocusables.nth(focusableCount - 1).focus()
  await page.keyboard.press('Tab')
  await expect(closeButton).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(dialogFocusables.nth(focusableCount - 1)).toBeFocused()

  await page.keyboard.press('Escape')
  await expect(modal).toBeHidden()
  await expect(opener).toBeFocused()
  await expect(page.locator('body > .site-header')).toHaveJSProperty('inert', false)
  await expect(page.locator('html')).not.toHaveAttribute('data-modal-scroll-lock', '')
})

test('actionable Toast is isolated while Modal is active and restored afterward', async ({ page }) => {
  await page.goto('/playground.html#toasts-title')

  await page.locator('[data-toast-trigger][data-toast-target="toast-action-template"]').click()
  const toast = page.locator('[data-toast-region] [data-toast]')
  const toastControl = toast.locator('a[href], button').first()
  await expect(toast).toBeVisible()

  await page.locator('[data-modal-open="basic-modal"]').click()
  const modal = page.locator('#basic-modal')
  const dialog = modal.locator('[data-modal-dialog]')
  await expect(modal).toBeVisible()
  await expect.poll(() => page.locator('[data-toast-region]').evaluate(
    (region) => region.closest('[inert]') !== null,
  )).toBe(true)
  await expect(toast).toBeVisible()

  const toastReceivesPointer = await toastControl.evaluate((control) => {
    const rect = control.getBoundingClientRect()
    const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)
    return hit === control || control.contains(hit)
  })
  expect(toastReceivesPointer).toBe(false)

  await toastControl.evaluate((control) => control.focus())
  await expect.poll(() => page.evaluate(() => {
    const active = document.activeElement
    return active instanceof Element && document.querySelector('#basic-modal [data-modal-dialog]')?.contains(active)
  })).toBe(true)

  const layers = await page.evaluate(() => ({
    modal: Number(getComputedStyle(document.querySelector('#basic-modal')).zIndex),
    toast: Number(getComputedStyle(document.querySelector('[data-toast-region]')).zIndex),
  }))
  expect(layers.modal).toBeGreaterThan(layers.toast)

  await page.keyboard.press('Escape')
  await expect(modal).toBeHidden()
  await expect.poll(() => page.locator('[data-toast-region]').evaluate(
    (region) => region.closest('[inert]') === null,
  )).toBe(true)
  await toastControl.focus()
  await expect(toastControl).toBeFocused()
  await expect(dialog).toBeHidden()
})
