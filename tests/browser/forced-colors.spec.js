import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ forcedColors: 'active' })
  await expect.poll(() => page.evaluate(() => matchMedia('(forced-colors: active)').matches)).toBe(true)
})

test('custom selection controls retain state geometry and focus', async ({ page }) => {
  await page.goto('/playground.html#form-controls-title')

  await expect.poll(() => page.locator('#checkbox-indeterminate').evaluate((input) => input.indeterminate)).toBe(true)

  const checkboxState = await page.evaluate(() => {
    const ids = [
      'checkbox-unchecked',
      'checkbox-checked',
      'checkbox-disabled',
      'checkbox-disabled-checked',
      'checkbox-indeterminate',
    ]

    return ids.map((id) => {
      const input = document.getElementById(id)
      const control = input.nextElementSibling
      const controlStyle = getComputedStyle(control)
      const markStyle = getComputedStyle(control, '::after')
      return {
        id,
        checked: input.checked,
        indeterminate: input.indeterminate,
        disabled: input.disabled,
        controlDisplay: controlStyle.display,
        controlBorderStyle: controlStyle.borderStyle,
        controlBorderWidth: parseFloat(controlStyle.borderWidth),
        controlColor: controlStyle.color,
        markOpacity: markStyle.opacity,
        markWidth: parseFloat(markStyle.width),
        markHeight: parseFloat(markStyle.height),
        markBorderBlockStartStyle: markStyle.borderBlockStartStyle,
        markBorderBlockStartWidth: parseFloat(markStyle.borderBlockStartWidth),
        markBorderInlineEndStyle: markStyle.borderInlineEndStyle,
        markBorderInlineEndWidth: parseFloat(markStyle.borderInlineEndWidth),
        markBorderBlockEndStyle: markStyle.borderBlockEndStyle,
        markBorderBlockEndWidth: parseFloat(markStyle.borderBlockEndWidth),
        markTransform: markStyle.transform,
      }
    })
  })

  for (const state of checkboxState) {
    expect(state.controlDisplay).toBe('grid')
    expect(state.controlBorderStyle).toBe('solid')
    expect(state.controlBorderWidth).toBeGreaterThan(0)
  }
  expect(checkboxState.map(({ checked, indeterminate, disabled }) => ({ checked, indeterminate, disabled }))).toEqual([
    { checked: false, indeterminate: false, disabled: false },
    { checked: true, indeterminate: false, disabled: false },
    { checked: false, indeterminate: false, disabled: true },
    { checked: true, indeterminate: false, disabled: true },
    { checked: false, indeterminate: true, disabled: false },
  ])
  const [unchecked, checked, disabledUnchecked, disabledChecked, indeterminate] = checkboxState
  expect(unchecked.markOpacity).toBe('0')
  expect(checked.markOpacity).toBe('1')
  expect(checked.markBorderInlineEndStyle).toBe('solid')
  expect(checked.markBorderInlineEndWidth).toBeGreaterThan(0)
  expect(checked.markBorderBlockEndStyle).toBe('solid')
  expect(checked.markBorderBlockEndWidth).toBeGreaterThan(0)
  expect(checked.markTransform).not.toBe('none')
  expect(indeterminate.markOpacity).toBe('1')
  expect(indeterminate.markBorderBlockStartStyle).toBe('solid')
  expect(indeterminate.markBorderBlockStartWidth).toBeGreaterThan(0)
  expect(indeterminate.markWidth).toBeGreaterThan(indeterminate.markHeight)
  expect(disabledChecked.markOpacity).toBe('1')
  expect(disabledChecked.markBorderInlineEndWidth).toBeGreaterThan(0)
  expect(disabledUnchecked.controlColor).toBe(disabledChecked.controlColor)
  expect(disabledChecked.controlColor).not.toBe(checked.controlColor)

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

  const pickerCases = [
    ['#date-picker-standard', 'date'],
    ['#time-picker-working-hours', 'time'],
  ]
  const productionCss = await page.evaluate(async () => {
    const urls = [...document.styleSheets].map((sheet) => sheet.href).filter(Boolean)
    return (await Promise.all(urls.map((url) => fetch(url).then((response) => response.text())))).join('\n')
  })
  for (const selector of ['date-picker', 'time-picker']) {
    expect(productionCss).toMatch(new RegExp(`\\.${selector}__control::-webkit-calendar-picker-indicator\\{[^}]*forced-color-adjust:none`))
  }
  const forcedPickerStates = []

  for (const [selector, type] of pickerCases) {
    const pickerState = await page.locator(selector).evaluate((control) => {
      const indicator = getComputedStyle(control, '::-webkit-calendar-picker-indicator')
      const controlStyle = getComputedStyle(control)
      const rect = control.getBoundingClientRect()
      return {
        type: control.type,
        inputPointerEvents: controlStyle.pointerEvents,
        inputWidth: rect.width,
        inputHeight: rect.height,
        inputPaddingInlineEnd: parseFloat(controlStyle.paddingInlineEnd),
        indicatorDisplay: indicator.display,
        indicatorPosition: indicator.position,
        indicatorPointerEvents: indicator.pointerEvents,
        indicatorBorderStyle: indicator.borderStyle,
        indicatorBorderWidth: parseFloat(indicator.borderWidth),
      }
    })

    expect(pickerState.type).toBe(type)
    expect(pickerState.inputPointerEvents).not.toBe('none')
    expect(pickerState.inputWidth).toBeGreaterThan(0)
    expect(pickerState.inputHeight).toBeGreaterThan(0)
    expect(pickerState.inputPaddingInlineEnd).toBeGreaterThan(0)
    expect(pickerState.indicatorDisplay).not.toBe('none')
    expect(['absolute', 'fixed']).not.toContain(pickerState.indicatorPosition)
    expect(pickerState.indicatorPointerEvents).not.toBe('none')
    expect(pickerState.indicatorBorderStyle).toBe('solid')
    expect(pickerState.indicatorBorderWidth).toBeGreaterThan(0)
    forcedPickerStates.push(pickerState)
  }

  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 844 })
    const geometry = await page.evaluate((selectors) => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      controls: selectors.map((selector) => {
        const control = document.querySelector(selector)
        const indicator = getComputedStyle(control, '::-webkit-calendar-picker-indicator')
        const rect = control.getBoundingClientRect()
        return {
          width: rect.width,
          height: rect.height,
          paddingInlineEnd: parseFloat(getComputedStyle(control).paddingInlineEnd),
          indicatorDisplay: indicator.display,
        }
      }),
    }), pickerCases.map(([selector]) => selector))
    expect(geometry.overflow).toBeLessThanOrEqual(1)
    for (const control of geometry.controls) {
      expect(control.width).toBeLessThanOrEqual(width)
      expect(control.indicatorDisplay).not.toBe('none')
      expect(control.paddingInlineEnd).toBeGreaterThan(0)
    }
  }

  await page.emulateMedia({ forcedColors: 'none' })
  await expect.poll(() => page.evaluate(() => matchMedia('(forced-colors: active)').matches)).toBe(false)

  await page.setViewportSize({ width: 1280, height: 720 })
  for (const [index, [selector]] of pickerCases.entries()) {
    const normalState = await page.locator(selector).evaluate((control) => {
      const rect = control.getBoundingClientRect()
      const indicator = getComputedStyle(control, '::-webkit-calendar-picker-indicator')
      return {
        inputWidth: rect.width,
        inputHeight: rect.height,
        indicatorForcedColorAdjust: indicator.forcedColorAdjust,
      }
    })

    expect(normalState.indicatorForcedColorAdjust).not.toBe('none')
    expect(normalState.inputWidth).toBeCloseTo(forcedPickerStates[index].inputWidth, 0)
    expect(normalState.inputHeight).toBeCloseTo(forcedPickerStates[index].inputHeight, 0)
  }
})

test('responsive Navigation toggle retains forced-colors menu and close geometry', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  const toggle = page.locator('[data-navigation-toggle]')
  const bars = toggle.locator('.site-header__menu-icon > span')
  await expect(toggle).toBeVisible()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')

  const closedState = await bars.evaluateAll((elements) => elements.map((element) => {
    const style = getComputedStyle(element)
    const rect = element.getBoundingClientRect()
    return {
      visible: rect.width > 0 && rect.height > 0,
      backgroundColor: style.backgroundColor,
      forcedColorAdjust: getComputedStyle(element.parentElement).forcedColorAdjust,
    }
  }))
  expect(closedState).toHaveLength(3)
  for (const bar of closedState) {
    expect(bar.visible).toBe(true)
    expect(bar.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    expect(bar.forcedColorAdjust).toBe('none')
  }

  await toggle.focus()
  await expect(toggle).toBeFocused()
  expect(await toggle.evaluate((control) => getComputedStyle(control).outlineStyle)).toBe('solid')

  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await expect(bars.nth(1)).toBeHidden()
  const openState = await Promise.all([bars.first(), bars.last()].map((bar) => bar.evaluate((element) => {
    const style = getComputedStyle(element)
    const rect = element.getBoundingClientRect()
    return {
      visible: rect.width > 0 && rect.height > 0,
      backgroundColor: style.backgroundColor,
      transform: style.transform,
    }
  })))
  for (const bar of openState) {
    expect(bar.visible).toBe(true)
    expect(bar.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    expect(bar.transform).not.toBe('none')
  }

  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(bars.nth(1)).toBeVisible()

  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/playground.html')

  const playgroundToggle = page.locator('[data-playground-navigation-toggle]')
  const playgroundBars = playgroundToggle.locator('.site-header__menu-icon > span')
  const playgroundClose = playgroundToggle.locator('.playground-navigation-toggle__close-icon')
  await expect(playgroundToggle).toBeVisible()
  await expect(playgroundToggle).toHaveAttribute('aria-expanded', 'false')
  await expect(playgroundBars).toHaveCount(3)
  for (const bar of await playgroundBars.all()) {
    expect(await bar.evaluate((element) => {
      const style = getComputedStyle(element)
      return element.getBoundingClientRect().height > 0 && style.backgroundColor !== 'rgba(0, 0, 0, 0)'
    })).toBe(true)
  }

  await playgroundToggle.click()
  await expect(playgroundToggle).toHaveAttribute('aria-expanded', 'true')
  await expect(playgroundBars.first()).toBeHidden()
  await expect(playgroundClose).toBeVisible()
  const closeState = await playgroundClose.evaluate((icon) => ({
    width: icon.getBoundingClientRect().width,
    height: icon.getBoundingClientRect().height,
    stroke: getComputedStyle(icon).stroke,
  }))
  expect(closeState.width).toBeGreaterThan(0)
  expect(closeState.height).toBeGreaterThan(0)
  expect(closeState.stroke).not.toBe('none')
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

  await page.keyboard.press('Escape')
  await page.locator('[data-modal-open="contact-drawer-modal"]').evaluate((opener) => opener.click())
  const drawer = page.locator('#contact-drawer-modal [data-modal-dialog]')
  const drawerClose = drawer.locator('[data-modal-close]').first()
  await expect(drawerClose).toBeFocused()
  const drawerState = await drawer.evaluate((element) => ({
    border: getComputedStyle(element).borderStyle,
    borderWidth: parseFloat(getComputedStyle(element).borderWidth),
  }))
  const drawerCloseState = await drawerClose.evaluate((control) => ({
    border: getComputedStyle(control).borderStyle,
    outline: getComputedStyle(control).outlineStyle,
  }))
  expect(drawerState.border).toBe('solid')
  expect(drawerState.borderWidth).toBeGreaterThan(0)
  expect(drawerCloseState).toEqual({ border: 'solid', outline: 'solid' })
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
