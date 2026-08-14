import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ forcedColors: 'active' })
  await expect.poll(() => page.evaluate(() => matchMedia('(forced-colors: active)').matches)).toBe(true)
})

test('custom selection controls retain state geometry and focus', async ({ page }) => {
  await page.goto('/playground.html#form-controls-title')

  const checkboxState = await page.evaluate(() => {
    const unchecked = document.querySelector('#checkbox-unchecked + .checkbox__control')
    const checked = document.querySelector('#checkbox-checked + .checkbox__control')
    const uncheckedMark = getComputedStyle(unchecked, '::after')
    const checkedMark = getComputedStyle(checked, '::after')

    return {
      uncheckedBorder: getComputedStyle(unchecked).borderStyle,
      uncheckedMarkOpacity: uncheckedMark.opacity,
      checkedMarkOpacity: checkedMark.opacity,
      checkedMarkContent: checkedMark.content,
    }
  })

  expect(checkboxState.uncheckedBorder).toBe('solid')
  expect(checkboxState.uncheckedMarkOpacity).toBe('0')
  expect(checkboxState.checkedMarkOpacity).toBe('1')
  expect(checkboxState.checkedMarkContent).not.toBe('none')

  const checkbox = page.locator('#checkbox-unchecked')
  await checkbox.focus()
  await expect(checkbox).toBeFocused()
  const checkboxFocus = await checkbox.evaluate((input) => getComputedStyle(input.nextElementSibling).outlineStyle)
  expect(checkboxFocus).toBe('solid')

  const radioState = await page.evaluate(() => ({
    unchecked: getComputedStyle(document.querySelector('#radio-unselected + .radio__control'), '::after').opacity,
    checked: getComputedStyle(document.querySelector('#radio-selected + .radio__control'), '::after').opacity,
  }))
  expect(radioState).toEqual({ unchecked: '0', checked: '1' })

  const switchPositions = await page.evaluate(() => {
    const off = document.querySelector('#switch-off + .switch__track .switch__thumb')
    const on = document.querySelector('#switch-on + .switch__track .switch__thumb')
    const track = document.querySelector('#switch-off + .switch__track')
    return {
      off: off.getBoundingClientRect().left,
      on: on.getBoundingClientRect().left,
      boundary: getComputedStyle(track).borderStyle,
    }
  })
  expect(Math.abs(switchPositions.on - switchPositions.off)).toBeGreaterThan(4)
  expect(switchPositions.boundary).toBe('solid')
})

test('native and custom form controls retain visible affordances', async ({ page }) => {
  await page.goto('/playground.html#form-controls-title')

  const select = page.locator('#select-standard')
  const selectState = await select.evaluate((control) => {
    const style = getComputedStyle(control)
    const icon = control.nextElementSibling
    return {
      border: style.borderStyle,
      color: style.color,
      iconDisplay: getComputedStyle(icon).display,
      iconWidth: icon.getBoundingClientRect().width,
    }
  })
  expect(selectState.border).toBe('solid')
  expect(selectState.color).not.toBe('transparent')
  expect(selectState.iconDisplay).not.toBe('none')
  expect(selectState.iconWidth).toBeGreaterThan(0)

  const range = page.locator('#range-volume')
  await range.focus()
  await expect(range).toBeFocused()
  const rangeState = await range.evaluate((control) => {
    const rect = control.getBoundingClientRect()
    const thumb = getComputedStyle(control, '::-webkit-slider-thumb')
    return {
      width: rect.width,
      height: rect.height,
      thumbWidth: parseFloat(thumb.width),
      thumbHeight: parseFloat(thumb.height),
      outline: getComputedStyle(control).outlineStyle,
    }
  })
  expect(rangeState.width).toBeGreaterThan(100)
  expect(rangeState.height).toBeGreaterThan(20)
  expect(rangeState.thumbWidth).toBeGreaterThan(0)
  expect(rangeState.thumbHeight).toBeGreaterThan(0)
  expect(rangeState.outline).toBe('solid')

  const fileInput = page.locator('#file-input-standard')
  await fileInput.focus()
  const fileState = await fileInput.evaluate((control) => {
    const button = getComputedStyle(control, '::file-selector-button')
    return {
      controlBorder: getComputedStyle(control).borderStyle,
      buttonBorder: button.borderStyle,
      buttonDisplay: button.display,
      outline: getComputedStyle(control).outlineStyle,
    }
  })
  expect(fileState.controlBorder).toBe('solid')
  expect(fileState.buttonBorder).toBe('solid')
  expect(fileState.buttonDisplay).not.toBe('none')
  expect(fileState.outline).toBe('solid')
})

test('current states, feedback, and Modal retain visible boundaries', async ({ page }) => {
  await page.goto('/playground.html#tabs')

  const tab = page.locator('#workspace-tab-overview')
  await tab.focus()
  const tabState = await tab.evaluate((control) => {
    const style = getComputedStyle(control)
    return {
      selected: control.getAttribute('aria-selected'),
      indicator: style.borderBottomStyle,
      indicatorWidth: parseFloat(style.borderBottomWidth),
      outline: style.outlineStyle,
    }
  })
  expect(tabState.selected).toBe('true')
  expect(tabState.indicator).toBe('solid')
  expect(tabState.indicatorWidth).toBeGreaterThan(0)
  expect(tabState.outline).toBe('solid')

  const currentPage = page.locator('.pagination__current').first()
  const paginationState = await currentPage.evaluate((current) => {
    const style = getComputedStyle(current)
    const link = current.closest('.pagination__list').querySelector('.pagination__link')
    return {
      border: style.borderStyle,
      currentBorderWidth: parseFloat(style.borderWidth),
      linkBorderWidth: parseFloat(getComputedStyle(link).borderWidth),
    }
  })
  expect(paginationState.border).toBe('solid')
  expect(paginationState.currentBorderWidth).toBeGreaterThan(paginationState.linkBorderWidth)

  const progressState = await page.locator('.progress').filter({ has: page.locator('[aria-valuenow="50"]') }).first().evaluate((progress) => {
    const track = progress.querySelector('.progress__track')
    const bar = progress.querySelector('.progress__bar')
    return {
      trackBorder: getComputedStyle(track).borderStyle,
      trackWidth: track.getBoundingClientRect().width,
      barWidth: bar.getBoundingClientRect().width,
    }
  })
  expect(progressState.trackBorder).toBe('solid')
  expect(progressState.barWidth).toBeGreaterThan(0)
  expect(progressState.barWidth).toBeLessThan(progressState.trackWidth)

  const spinner = page.locator('.spinner__visual').first()
  const spinnerState = await spinner.evaluate((visual) => {
    const style = getComputedStyle(visual)
    return { border: style.borderStyle, width: parseFloat(style.borderWidth) }
  })
  expect(spinnerState.border).toBe('solid')
  expect(spinnerState.width).toBeGreaterThan(0)

  await page.locator('[data-modal-open="basic-modal"]').evaluate((opener) => opener.click())
  const dialog = page.locator('#basic-modal [data-modal-dialog]')
  const close = dialog.locator('[data-modal-close]').first()
  await expect(close).toBeFocused()
  await page.keyboard.press('Tab')
  await page.keyboard.press('Shift+Tab')
  await expect(close).toBeFocused()
  const modalState = await dialog.evaluate((element) => getComputedStyle(element).borderStyle)
  const closeState = await close.evaluate((control) => ({
    border: getComputedStyle(control).borderStyle,
    outline: getComputedStyle(control).outlineStyle,
  }))
  expect(modalState).toBe('solid')
  expect(closeState).toEqual({ border: 'solid', outline: 'solid' })
})

test('featured marketing surfaces remain readable and bounded', async ({ page }) => {
  await page.goto('/playground.html#pricing-cards')

  for (const selector of ['.pricing-card--featured', '.cta-banner--featured']) {
    const state = await page.locator(selector).first().evaluate((component) => {
      const style = getComputedStyle(component)
      const heading = component.querySelector('h3, h4')
      return {
        border: style.borderStyle,
        borderWidth: parseFloat(style.borderWidth),
        headingVisible: heading?.getBoundingClientRect().height > 0,
        headingColor: heading ? getComputedStyle(heading).color : 'transparent',
      }
    })
    expect(state.border).toBe('solid')
    expect(state.borderWidth).toBeGreaterThan(0)
    expect(state.headingVisible).toBe(true)
    expect(state.headingColor).not.toBe('transparent')
  }
})
