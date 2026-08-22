import { expect, test } from '@playwright/test'

test('Navigation and Accordion expose synchronized disclosure relationships', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 664 })
  await page.goto('/playground.html#accordion-title')

  const navigation = page.locator('[data-navigation]')
  const navigationToggle = navigation.locator('[data-navigation-toggle]')
  const navigationMenuId = await navigationToggle.getAttribute('aria-controls')

  expect(navigationMenuId).toBeTruthy()
  await expect(page.locator(`#${navigationMenuId}`)).toHaveAttribute('aria-label', /documentation/i)
  await navigationToggle.click()
  await expect(navigationToggle).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator('main')).toHaveJSProperty('inert', true)
  await page.keyboard.press('Escape')
  await expect(navigationToggle).toHaveAttribute('aria-expanded', 'false')
  await expect(navigationToggle).toBeFocused()

  const accordionTrigger = page.locator('#playground-single-trigger-2')
  const accordionPanel = page.locator('#playground-single-panel-2')
  await expect(accordionTrigger).toHaveRole('button')
  await expect(accordionTrigger).toHaveAttribute('aria-controls', 'playground-single-panel-2')
  await expect(accordionPanel).toHaveAttribute('aria-labelledby', 'playground-single-trigger-2')
  await expect(accordionPanel).toBeHidden()
  await accordionTrigger.click()
  await expect(accordionTrigger).toHaveAttribute('aria-expanded', 'true')
  await expect(accordionPanel).toBeVisible()
  await expect(accordionTrigger).toBeFocused()
})

test('Tabs keep names, selection, relationships, and hidden panels synchronized', async ({ page }) => {
  await page.goto('/playground.html#tabs')

  const tablist = page.getByRole('tablist', { name: 'Project workspace' })
  const overview = tablist.getByRole('tab', { name: 'Overview' })
  const activity = tablist.getByRole('tab', { name: 'Activity' })
  const overviewPanel = page.getByRole('tabpanel', { name: 'Overview', exact: true })

  await expect(tablist).toBeVisible()
  await expect(overview).toHaveAttribute('aria-controls', 'workspace-panel-overview')
  await expect(overviewPanel).toHaveAttribute('aria-labelledby', 'workspace-tab-overview')
  await expect(overview).toHaveAttribute('aria-selected', 'true')
  await expect(overview).toHaveAttribute('tabindex', '0')

  await overview.focus()
  await page.keyboard.press('ArrowRight')
  await expect(activity).toHaveAttribute('aria-selected', 'true')
  await expect(activity).toHaveAttribute('tabindex', '0')
  await expect(overview).toHaveAttribute('aria-selected', 'false')
  await expect(overviewPanel).toBeHidden()
  await expect(page.getByRole('tabpanel', { name: 'Activity' })).toBeVisible()

  await expect(page.getByRole('tablist', { name: 'Account settings' })).toHaveAttribute(
    'aria-orientation',
    'vertical',
  )
})

test('Modal exposes one labelled dialog and restores focus without stale isolation', async ({ page }) => {
  await page.goto('/playground.html#modals-title')

  const opener = page.getByRole('button', { name: 'Open basic modal' })
  await opener.click()

  const dialog = page.getByRole('dialog', { name: 'Review workspace details' })
  await expect(dialog).toBeVisible()
  await expect(dialog).toHaveAttribute('aria-modal', 'true')
  await expect(dialog).toHaveAttribute('aria-labelledby', 'basic-modal-title')
  await expect(dialog).toHaveAttribute('aria-describedby', 'basic-modal-description')
  await expect(page.locator('body > .site-header')).toHaveJSProperty('inert', true)
  await expect(dialog.getByRole('button', { name: 'Close workspace details dialog' })).toBeFocused()

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(opener).toBeFocused()
  await expect(page.locator('body > .site-header')).toHaveJSProperty('inert', false)

  const drawerOpener = page.getByRole('button', { name: 'Open contact Drawer' })
  await drawerOpener.click()

  const drawer = page.getByRole('dialog', { name: 'Contact the project team' })
  await expect(drawer).toBeVisible()
  await expect(drawer).toHaveAttribute('aria-modal', 'true')
  await expect(drawer).toHaveAttribute('aria-labelledby', 'contact-drawer-modal-title')
  await expect(drawer).toHaveAttribute('aria-describedby', 'contact-drawer-modal-description')
  await expect(drawer.getByRole('button', { name: 'Close contact team Drawer' })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(drawer).toBeHidden()
  await expect(drawerOpener).toBeFocused()
})

test('Toast and Alert use scoped announcements and contextual dismiss names', async ({ page }) => {
  await page.goto('/playground.html#toasts')

  const region = page.locator('[data-toast-region]')
  await expect(region).toHaveAttribute('aria-label', 'Notifications')
  await expect(region).toHaveAttribute('aria-live', 'polite')
  await expect(region).toHaveAttribute('aria-relevant', 'additions')
  await expect(region).not.toHaveAttribute('role', /alert|status/)

  const trigger = page.getByRole('button', { name: 'Show action Toast' })
  await trigger.focus()
  await trigger.click()
  const toast = region.locator('[data-toast]')
  await expect(toast).toBeVisible()
  await expect(toast).not.toHaveAttribute('role', /alert|status/)
  await expect(toast.getByRole('button', { name: 'Dismiss report notification' })).toBeVisible()
  await expect(trigger).toBeFocused()

  const staticAlerts = page.locator('[data-alert], .alert')
  expect(await staticAlerts.count()).toBeGreaterThan(0)
  await expect(staticAlerts.first()).not.toHaveAttribute('role', /alert|status/)
  await expect(page.getByRole('button', { name: 'Dismiss saved-changes message' })).toBeVisible()
})

test('native form controls retain names, roles, descriptions, and state ownership', async ({ page }) => {
  await page.goto('/playground.html#form-controls-title')

  await expect(page.getByRole('checkbox', { name: 'Checked', exact: true })).toBeChecked()
  await expect(page.getByRole('radio', { name: /Weekly summary/ })).toBeChecked()
  await expect(page.getByRole('switch', { name: 'On', exact: true })).toBeChecked()

  const select = page.getByLabel('Project category (required)')
  await expect(select).toHaveAttribute('aria-describedby', 'select-standard-description')
  await expect(select).toHaveAttribute('required', '')

  const password = page.getByRole('textbox', { name: 'Account password', exact: true })
  const passwordToggle = page.locator('[data-password-input]').filter({ has: password }).locator(
    '[data-password-input-toggle]',
  )
  await expect(passwordToggle).toHaveAccessibleName('Show account password')
  await expect(password).toHaveAttribute('type', 'password')
  await passwordToggle.click()
  await expect(password).toHaveAttribute('type', 'text')
  await expect(passwordToggle).toHaveAttribute('aria-pressed', 'true')
  await expect(passwordToggle).toHaveAccessibleName('Hide account password')
  await expect(passwordToggle).toBeFocused()

  await expect(page.getByRole('spinbutton', { name: 'Quantity', exact: true })).toHaveAttribute('min', '1')
  await expect(page.getByRole('button', { name: 'Decrease quantity' })).toHaveAttribute(
    'aria-controls',
    'stepper-quantity',
  )

  const range = page.getByRole('slider', { name: 'Volume' })
  await expect(range).toHaveAttribute('min', '0')
  await expect(range).toHaveAttribute('max', '100')
  await expect(range).toHaveValue('50')
  await expect(page.getByLabel('Supporting document')).toHaveAttribute(
    'aria-describedby',
    'file-input-standard-description',
  )
  await expect(page.getByLabel('Project start date')).toHaveAttribute('type', 'date')
  await expect(page.getByLabel('Preferred meeting time')).toHaveAttribute('type', 'time')
  await expect(page.getByLabel('Project review')).toHaveAttribute('type', 'datetime-local')
})

test('native validation remains authoritative without custom invalid-state noise', async ({ page }) => {
  await page.goto('/playground.html#forms-title')

  const form = page.locator('form[data-playground-form-demo]').filter({
    has: page.locator('#password-validation'),
  })
  const password = form.locator('#password-validation')
  const baseline = await page.evaluate(() => ({ href: location.href, historyLength: history.length }))

  await expect(password).not.toHaveAttribute('aria-invalid')
  expect(await password.evaluate((control) => control.validity.valueMissing)).toBe(true)
  await form.locator('button[type="submit"]').click()
  expect(await password.evaluate((control) => control.validity.valid)).toBe(false)
  await expect(password).not.toHaveAttribute('aria-invalid')
  expect(page.url()).toBe(baseline.href)
  expect(await page.evaluate(() => history.length)).toBe(baseline.historyLength)
})

test('Progress, Spinner, Skeleton, and static content preserve concise reading contracts', async ({ page }) => {
  await page.goto('/playground.html#progress-title')

  const progress = page.getByRole('progressbar', { name: 'Background import progress' })
  await expect(progress).toHaveAttribute('aria-valuemin', '0')
  await expect(progress).toHaveAttribute('aria-valuemax', '100')
  await expect(progress).toHaveAttribute('aria-valuenow', '75')

  await expect(page.getByRole('status', { name: 'Loading account summary' })).toBeVisible()
  await expect(page.locator('.spinner[aria-hidden="true"]')).toHaveCount(1)
  await expect(page.locator('.skeleton').first()).not.toHaveAttribute('role')
  expect(await page.locator('[aria-busy="true"]').count()).toBeGreaterThan(0)

  const testimonial = page.locator('.testimonial').first()
  const testimonialOrder = await testimonial
    .locator('.testimonial__quote, .testimonial__footer')
    .evaluateAll((elements) => elements.map((element) => element.tagName))
  expect(testimonialOrder).toEqual(['BLOCKQUOTE', 'FIGCAPTION'])

  const featuredPricing = page.locator('.pricing-card--featured').first()
  await expect(featuredPricing).not.toHaveAttribute('role')
  await expect(featuredPricing.getByText('Recommended', { exact: true })).toBeVisible()
})

test('Tooltip keeps accessible names independent from persistent descriptions', async ({ page }) => {
  await page.goto('/playground.html#tooltips-title')

  const trigger = page.locator('#tooltip-save-trigger')
  const content = page.locator('#tooltip-save-content')

  await expect(trigger).toHaveRole('button')
  await expect(trigger).toHaveAccessibleName('Save draft')
  await expect(trigger).toHaveAttribute('aria-describedby', 'tooltip-save-content')
  await expect(trigger).not.toHaveAttribute('aria-expanded')
  await expect(trigger).not.toHaveAttribute('aria-haspopup')
  await expect(content).toHaveRole('tooltip')
  await expect(content).not.toHaveAttribute('aria-live')
  await expect(content).not.toHaveAttribute('tabindex')
  await expect(content.locator('a, button, input, select, textarea, [tabindex]')).toHaveCount(0)

  await trigger.focus()
  await expect(content).toBeVisible()
  await expect(trigger).toBeFocused()
  await expect(trigger).toHaveAccessibleName('Save draft')
  await page.keyboard.press('Escape')
  await expect(content).toBeHidden()
  await expect(trigger).toHaveAttribute('aria-describedby', 'tooltip-save-content')
  await expect(trigger).toHaveAccessibleName('Save draft')
})
