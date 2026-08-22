const rootSelector = '[data-tooltip]'
const triggerSelector = '[data-tooltip-trigger]'
const contentSelector = '[data-tooltip-content]'
const pointerOpenDelay = 400
const pointerCloseDelay = 100
const finePointerQuery = '(hover: hover) and (pointer: fine)'

const initializedRoots = new WeakSet()
const activeByDocument = new WeakMap()

function hasIndependentName(trigger, ownerDocument, tooltipId) {
  const ariaLabel = trigger.getAttribute('aria-label')?.trim() ?? ''

  if (ariaLabel !== '') {
    return true
  }

  const labelledBy = trigger.getAttribute('aria-labelledby')?.trim().split(/\s+/).filter(Boolean) ?? []

  if (
    labelledBy.length > 0 &&
    !labelledBy.includes(tooltipId) &&
    labelledBy.every((id) => (ownerDocument.getElementById(id)?.textContent.trim() ?? '') !== '')
  ) {
    return true
  }

  return trigger.textContent.trim() !== ''
}

function isSupportedTrigger(trigger) {
  if (trigger.getAttribute('aria-disabled') === 'true') {
    return false
  }

  return (
    (trigger instanceof HTMLButtonElement && !trigger.disabled) ||
    (trigger instanceof HTMLAnchorElement && trigger.hasAttribute('href'))
  )
}

function getValidInstance(root) {
  if (!(root instanceof HTMLElement)) {
    return null
  }

  const ownerDocument = root.ownerDocument
  const triggers = root.querySelectorAll(triggerSelector)
  const contents = root.querySelectorAll(contentSelector)

  if (triggers.length !== 1 || contents.length !== 1) {
    return null
  }

  const trigger = triggers[0]
  const content = contents[0]

  if (
    !isSupportedTrigger(trigger) ||
    !(content instanceof HTMLElement) ||
    content.id.trim() === '' ||
    /\s/.test(content.id) ||
    content.getAttribute('role') !== 'tooltip' ||
    content.childElementCount > 0 ||
    content.textContent.trim() === '' ||
    !hasIndependentName(trigger, ownerDocument, content.id)
  ) {
    return null
  }

  const describedBy = trigger.getAttribute('aria-describedby')?.trim().split(/\s+/).filter(Boolean) ?? []
  const matchingIds = [...ownerDocument.querySelectorAll('[id]')].filter(({ id }) => id === content.id)

  if (!describedBy.includes(content.id) || matchingIds.length !== 1) {
    return null
  }

  return { root, trigger, content, ownerDocument }
}

function initTooltip(root) {
  if (initializedRoots.has(root)) {
    return true
  }

  if (root instanceof HTMLElement) {
    root.querySelectorAll(contentSelector).forEach((content) => {
      if (content instanceof HTMLElement) {
        content.hidden = true
      }
    })
  }

  const instance = getValidInstance(root)

  if (instance === null) {
    return false
  }

  const { trigger, content, ownerDocument } = instance
  const view = ownerDocument.defaultView

  if (view === null) {
    return false
  }

  const finePointer = view.matchMedia(finePointerQuery)
  let openTimer = null
  let closeTimer = null
  let positionFrame = null
  let resizeObserver = null
  let disconnectObserver = null
  let hoveredTrigger = false
  let hoveredContent = false
  let focused = false
  let suppressed = false
  let open = false

  function clearOpenTimer() {
    if (openTimer !== null) {
      view.clearTimeout(openTimer)
      openTimer = null
    }
  }

  function clearCloseTimer() {
    if (closeTimer !== null) {
      view.clearTimeout(closeTimer)
      closeTimer = null
    }
  }

  function clearPositionFrame() {
    if (positionFrame !== null) {
      view.cancelAnimationFrame(positionFrame)
      positionFrame = null
    }
  }

  function getViewport() {
    const visualViewport = view.visualViewport

    if (visualViewport !== null) {
      return {
        top: visualViewport.offsetTop,
        left: visualViewport.offsetLeft,
        width: visualViewport.width,
        height: visualViewport.height,
      }
    }

    return { top: 0, left: 0, width: view.innerWidth, height: view.innerHeight }
  }

  function getPrivateLength(name) {
    const value = Number.parseFloat(view.getComputedStyle(content).getPropertyValue(name))
    return Number.isFinite(value) ? value : 0
  }

  function position() {
    positionFrame = null

    if (!open || !trigger.isConnected || !content.isConnected) {
      close({ suppress: true })
      return
    }

    const viewport = getViewport()
    const inset = getPrivateLength('--tooltip-viewport-inset')
    const gap = getPrivateLength('--tooltip-gap')
    const availableWidth = Math.max(0, viewport.width - inset * 2)
    const availableHeight = Math.max(0, viewport.height - inset * 2)

    content.style.setProperty('--tooltip-available-inline-size', `${availableWidth}px`)
    content.style.setProperty('--tooltip-available-block-size', `${availableHeight}px`)

    const triggerRect = trigger.getBoundingClientRect()
    const contentRect = content.getBoundingClientRect()
    const viewportRight = viewport.left + viewport.width
    const viewportBottom = viewport.top + viewport.height
    const spaceBefore = triggerRect.top - viewport.top - gap
    const spaceAfter = viewportBottom - triggerRect.bottom - gap
    const useBlockStart = spaceBefore >= contentRect.height || (
      spaceAfter < contentRect.height && spaceBefore >= spaceAfter
    )
    const preferredTop = useBlockStart
      ? triggerRect.top - gap - contentRect.height
      : triggerRect.bottom + gap
    const minimumTop = viewport.top + inset
    const maximumTop = Math.max(minimumTop, viewportBottom - inset - contentRect.height)
    const preferredLeft = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2
    const minimumLeft = viewport.left + inset
    const maximumLeft = Math.max(minimumLeft, viewportRight - inset - contentRect.width)

    content.style.top = `${Math.min(Math.max(preferredTop, minimumTop), maximumTop)}px`
    content.style.left = `${Math.min(Math.max(preferredLeft, minimumLeft), maximumLeft)}px`
    content.dataset.tooltipPosition = useBlockStart ? 'block-start' : 'block-end'
    content.dataset.tooltipPositioned = ''
  }

  function schedulePosition() {
    if (!open || positionFrame !== null) {
      return
    }

    positionFrame = view.requestAnimationFrame(position)
  }

  function addActiveListeners() {
    ownerDocument.addEventListener('keydown', onDocumentKeydown)
    ownerDocument.addEventListener('pointerdown', onDocumentPointerdown, true)
    view.addEventListener('scroll', schedulePosition, true)
    view.addEventListener('resize', schedulePosition)
    view.visualViewport?.addEventListener('scroll', schedulePosition)
    view.visualViewport?.addEventListener('resize', schedulePosition)

    if ('ResizeObserver' in view) {
      resizeObserver = new view.ResizeObserver(schedulePosition)
      resizeObserver.observe(trigger)
      resizeObserver.observe(content)
    }

    if ('MutationObserver' in view && ownerDocument.documentElement !== null) {
      disconnectObserver = new view.MutationObserver(() => {
        if (!trigger.isConnected || !content.isConnected) {
          close({ suppress: true })
        }
      })
      disconnectObserver.observe(ownerDocument.documentElement, { childList: true, subtree: true })
    }
  }

  function removeActiveListeners() {
    ownerDocument.removeEventListener('keydown', onDocumentKeydown)
    ownerDocument.removeEventListener('pointerdown', onDocumentPointerdown, true)
    view.removeEventListener('scroll', schedulePosition, true)
    view.removeEventListener('resize', schedulePosition)
    view.visualViewport?.removeEventListener('scroll', schedulePosition)
    view.visualViewport?.removeEventListener('resize', schedulePosition)
    resizeObserver?.disconnect()
    disconnectObserver?.disconnect()
    resizeObserver = null
    disconnectObserver = null
  }

  function openTooltip() {
    clearOpenTimer()
    clearCloseTimer()

    if (open || suppressed || !trigger.isConnected || !content.isConnected) {
      return
    }

    const current = activeByDocument.get(ownerDocument)

    if (current !== undefined && current !== instance) {
      current.close({ suppress: true })
    }

    open = true
    content.hidden = false
    activeByDocument.set(ownerDocument, instance)
    addActiveListeners()
    position()
  }

  function close({ suppress = false } = {}) {
    clearOpenTimer()
    clearCloseTimer()
    clearPositionFrame()

    if (suppress) {
      suppressed = true
    }

    if (!open) {
      return
    }

    open = false
    removeActiveListeners()
    content.hidden = true
    content.removeAttribute('data-tooltip-positioned')
    content.removeAttribute('data-tooltip-position')
    content.style.removeProperty('top')
    content.style.removeProperty('left')
    content.style.removeProperty('--tooltip-available-inline-size')
    content.style.removeProperty('--tooltip-available-block-size')

    if (activeByDocument.get(ownerDocument) === instance) {
      activeByDocument.delete(ownerDocument)
    }
  }

  function resetSuppressionIfDisengaged() {
    if (!focused && !hoveredTrigger && !hoveredContent) {
      suppressed = false
    }
  }

  function schedulePointerOpen() {
    clearOpenTimer()

    if (open || suppressed) {
      return
    }

    openTimer = view.setTimeout(openTooltip, pointerOpenDelay)
  }

  function schedulePointerClose() {
    clearOpenTimer()
    clearCloseTimer()

    if (focused || hoveredTrigger || hoveredContent) {
      return
    }

    closeTimer = view.setTimeout(() => {
      close()
      resetSuppressionIfDisengaged()
    }, pointerCloseDelay)
  }

  function onDocumentKeydown(event) {
    if (event.key === 'Escape') {
      close({ suppress: true })
    }
  }

  function onDocumentPointerdown(event) {
    if (!(event.target instanceof Node) || (!trigger.contains(event.target) && !content.contains(event.target))) {
      close({ suppress: true })
    }
  }

  trigger.addEventListener('focus', () => {
    focused = true

    if (trigger.matches(':focus-visible')) {
      openTooltip()
    }
  })

  trigger.addEventListener('blur', () => {
    focused = false

    if (!hoveredTrigger && !hoveredContent) {
      close()
    }

    resetSuppressionIfDisengaged()
  })

  trigger.addEventListener('pointerenter', (event) => {
    if (!finePointer.matches || event.pointerType === 'touch') {
      return
    }

    hoveredTrigger = true
    clearCloseTimer()
    schedulePointerOpen()
  })

  trigger.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'touch') {
      return
    }

    hoveredTrigger = false
    schedulePointerClose()
    resetSuppressionIfDisengaged()
  })

  content.addEventListener('pointerenter', (event) => {
    if (!finePointer.matches || event.pointerType === 'touch') {
      return
    }

    hoveredContent = true
    clearCloseTimer()
  })

  content.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'touch') {
      return
    }

    hoveredContent = false
    schedulePointerClose()
    resetSuppressionIfDisengaged()
  })

  trigger.addEventListener('click', () => close({ suppress: true }))

  instance.close = close
  content.hidden = true
  root.dataset.tooltipEnhanced = ''
  initializedRoots.add(root)
  return true
}

export function initTooltips(scope = document) {
  const roots = scope.querySelectorAll(rootSelector)
  roots.forEach(initTooltip)
}
