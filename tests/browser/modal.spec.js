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

test('Drawer presentation reuses the Modal focus and isolation lifecycle', async ({ page }) => {
  await page.goto('/playground.html#modal-drawer-examples-title')

  const opener = page.getByRole('button', { name: 'Open contact Drawer' })
  const modal = page.locator('#contact-drawer-modal')
  const dialog = modal.getByRole('dialog', { name: 'Contact the project team' })
  const closeButton = dialog.getByRole('button', { name: 'Close contact team Drawer' })

  await opener.click()
  await expect(modal).toBeVisible()
  await expect(dialog).toHaveAttribute('aria-modal', 'true')
  await expect(closeButton).toBeFocused()
  await expect(page.locator('body > .site-header')).toHaveJSProperty('inert', true)
  await expect(page.locator('html')).toHaveAttribute('data-modal-scroll-lock', '')

  const focusables = dialog.locator('button:not(:disabled), input:not(:disabled), textarea:not(:disabled)')
  await focusables.last().focus()
  await page.keyboard.press('Tab')
  await expect(closeButton).toBeFocused()

  await page.keyboard.press('Escape')
  await expect(modal).toBeHidden()
  await expect(opener).toBeFocused()
  await expect(page.locator('body > .site-header')).toHaveJSProperty('inert', false)
  await expect(page.locator('html')).not.toHaveAttribute('data-modal-scroll-lock', '')
})

test('Modal Drawer placement is logical, responsive, and viewport-bounded', async ({ page }) => {
  await page.goto('/playground.html#modal-drawer-examples-title')

  const centeredOpener = page.getByRole('button', { name: 'Open basic modal' })
  const centeredModal = page.locator('#basic-modal')
  const centeredDialog = centeredModal.locator('[data-modal-dialog]')

  await centeredOpener.click()
  const centered = await centeredDialog.evaluate((element) => {
    const rect = element.getBoundingClientRect()
    return {
      center: rect.left + rect.width / 2,
      viewportCenter: innerWidth / 2,
      alignSelf: getComputedStyle(element).alignSelf,
      justifySelf: getComputedStyle(element).justifySelf,
      animationName: getComputedStyle(element).animationName,
      animationDuration: getComputedStyle(element).animationDuration,
    }
  })
  expect(Math.abs(centered.center - centered.viewportCenter)).toBeLessThanOrEqual(1)
  expect(centered.alignSelf).not.toBe('stretch')
  expect(centered.justifySelf).not.toBe('start')
  expect(centered.justifySelf).not.toBe('end')
  await centeredModal.locator('[data-modal-close]').first().click()

  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 844 })

    for (const specimen of [
      { opener: 'Open contact Drawer', modal: '#contact-drawer-modal', edge: 'end' },
      { opener: 'Open filter Drawer', modal: '#filter-drawer-modal', edge: 'start' },
    ]) {
      await page.getByRole('button', { name: specimen.opener }).click()
      const geometry = await page.locator(specimen.modal).evaluate((modal, edge) => {
        const dialog = modal.querySelector('[data-modal-dialog]')
        const dialogRect = dialog.getBoundingClientRect()
        const modalStyle = getComputedStyle(modal)
        return {
          edge,
          left: dialogRect.left,
          right: dialogRect.right,
          top: dialogRect.top,
          bottom: dialogRect.bottom,
          width: dialogRect.width,
          height: dialogRect.height,
          paddingInlineStart: parseFloat(modalStyle.paddingInlineStart),
          paddingInlineEnd: parseFloat(modalStyle.paddingInlineEnd),
          paddingBlockStart: parseFloat(modalStyle.paddingBlockStart),
          paddingBlockEnd: parseFloat(modalStyle.paddingBlockEnd),
          viewportWidth: innerWidth,
          viewportHeight: innerHeight,
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          animationName: getComputedStyle(dialog).animationName,
          animationDuration: getComputedStyle(dialog).animationDuration,
        }
      }, specimen.edge)

      expect(geometry.left).toBeGreaterThanOrEqual(-1)
      expect(geometry.right).toBeLessThanOrEqual(geometry.viewportWidth + 1)
      expect(geometry.top).toBeGreaterThanOrEqual(-1)
      expect(geometry.bottom).toBeLessThanOrEqual(geometry.viewportHeight + 1)
      expect(geometry.width).toBeLessThanOrEqual(geometry.viewportWidth)
      expect(geometry.height).toBeLessThanOrEqual(geometry.viewportHeight)
      expect(geometry.overflow).toBeLessThanOrEqual(1)
      expect(geometry.animationName).toBe(centered.animationName)
      expect(geometry.animationDuration).toBe(centered.animationDuration)

      if (specimen.edge === 'end') {
        expect(Math.abs(geometry.right - (geometry.viewportWidth - geometry.paddingInlineEnd))).toBeLessThanOrEqual(1)
      } else {
        expect(Math.abs(geometry.left - geometry.paddingInlineStart)).toBeLessThanOrEqual(1)
      }

      await page.locator(specimen.modal).locator('[data-modal-close]').first().click()
    }
  }

  await page.setViewportSize({ width: 1024, height: 768 })
  await page.locator('html').evaluate((element) => { element.dir = 'rtl' })

  await page.getByRole('button', { name: 'Open contact Drawer' }).click()
  const rtlEnd = await page.locator('#contact-drawer-modal').evaluate((modal) => {
    const dialogRect = modal.querySelector('[data-modal-dialog]').getBoundingClientRect()
    return { left: dialogRect.left, paddingInlineEnd: parseFloat(getComputedStyle(modal).paddingInlineEnd) }
  })
  expect(rtlEnd.left).toBeCloseTo(rtlEnd.paddingInlineEnd, 0)
  await page.locator('#contact-drawer-modal [data-modal-close]').first().click()

  await page.getByRole('button', { name: 'Open filter Drawer' }).click()
  const rtlStart = await page.locator('#filter-drawer-modal').evaluate((modal) => {
    const dialogRect = modal.querySelector('[data-modal-dialog]').getBoundingClientRect()
    return {
      right: dialogRect.right,
      expectedRight: innerWidth - parseFloat(getComputedStyle(modal).paddingInlineStart),
    }
  })
  expect(rtlStart.right).toBeCloseTo(rtlStart.expectedRight, 0)
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

test('Modal actions remain reachable in a short reflow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 225 })
  await page.goto('/playground.html#modals-title')

  await page.locator('[data-modal-open="basic-modal"]').click()
  const modal = page.locator('#basic-modal')
  const dialog = modal.locator('[data-modal-dialog]')
  const footer = dialog.locator('.modal__footer')

  await expect(modal).toBeVisible()

  const initial = await dialog.evaluate((element) => {
    const rect = element.getBoundingClientRect()
    return {
      withinViewport: rect.top >= -1
        && rect.bottom <= innerHeight + 1
        && rect.left >= -1
        && rect.right <= innerWidth + 1,
      scrollable: element.scrollHeight > element.clientHeight
        && getComputedStyle(element).overflowY === 'auto',
    }
  })

  expect(initial).toEqual({ withinViewport: true, scrollable: true })

  await footer.evaluate((element) => element.scrollIntoView({ block: 'end' }))

  await expect.poll(() => footer.evaluate((element) => {
    const footerRect = element.getBoundingClientRect()
    const dialogRect = element.closest('[data-modal-dialog]').getBoundingClientRect()
    return footerRect.top >= dialogRect.top - 1 && footerRect.bottom <= dialogRect.bottom + 1
  })).toBe(true)
  await expect(page.locator('body > .site-header')).toHaveJSProperty('inert', true)
  await expect(page.locator('html')).toHaveAttribute('data-modal-scroll-lock', '')
})

test('Drawer actions remain reachable in a short reflow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 225 })
  await page.goto('/playground.html#modal-drawer-examples-title')

  await page.getByRole('button', { name: 'Open contact Drawer' }).click()
  const modal = page.locator('#contact-drawer-modal')
  const dialog = modal.locator('[data-modal-dialog]')
  const body = dialog.locator('.modal__body')
  const footer = dialog.locator('.modal__footer')
  const lastField = body.locator('#contact-drawer-summary')

  const initial = await dialog.evaluate((element) => {
    const rect = element.getBoundingClientRect()
    const body = element.querySelector('.modal__body')
    return {
      withinViewport: rect.top >= -1
        && rect.bottom <= innerHeight + 1
        && rect.left >= -1
        && rect.right <= innerWidth + 1,
      scrollable: (element.scrollHeight > element.clientHeight
          && getComputedStyle(element).overflowY === 'auto')
        || (body.scrollHeight > body.clientHeight
          && getComputedStyle(body).overflowY === 'auto'),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }
  })
  expect(initial).toEqual({ withinViewport: true, scrollable: true, overflow: 0 })

  await lastField.evaluate((element) => element.scrollIntoView({ block: 'nearest' }))
  await expect.poll(() => lastField.evaluate((element) => {
    const fieldRect = element.getBoundingClientRect()
    const bodyRect = element.closest('.modal__body').getBoundingClientRect()
    return fieldRect.top < bodyRect.bottom && fieldRect.bottom > bodyRect.top
  })).toBe(true)
  await footer.evaluate((element) => element.scrollIntoView({ block: 'end' }))
  await expect.poll(() => footer.evaluate((element) => {
    const footerRect = element.getBoundingClientRect()
    const dialogRect = element.closest('[data-modal-dialog]').getBoundingClientRect()
    return footerRect.top >= dialogRect.top - 1 && footerRect.bottom <= dialogRect.bottom + 1
  })).toBe(true)
  await expect(footer.getByRole('button', { name: 'Send request' })).toBeVisible()
  await expect(page.locator('body > .site-header')).toHaveJSProperty('inert', true)
  await expect(page.locator('html')).toHaveAttribute('data-modal-scroll-lock', '')
})
