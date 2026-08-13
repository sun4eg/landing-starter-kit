const rootSelector = '[data-playground-navigation]'
const toggleSelector = '[data-playground-navigation-toggle]'
const panelSelector = '[data-playground-navigation-panel]'
const linkSelector = '[data-playground-navigation-link]'

const initializedRoots = new WeakSet()
const anchorCorrection = 2

function getRoots(scope) {
  const roots = Array.from(scope.querySelectorAll(rootSelector))

  if (scope instanceof Element && scope.matches(rootSelector)) {
    roots.unshift(scope)
  }

  return roots
}

function getTargetId(link) {
  const href = link.getAttribute('href')
  return href?.startsWith('#') ? href.slice(1) : ''
}

function initPlaygroundNavigation(root) {
  if (initializedRoots.has(root)) {
    return true
  }

  const ownerDocument = root.ownerDocument
  const documentElement = ownerDocument.documentElement
  const view = ownerDocument.defaultView
  const toggle = root.querySelector(toggleSelector)
  const panel = root.querySelector(panelSelector)
  const navigationLinks = Array.from(root.querySelectorAll(linkSelector)).filter(
    (link) => link instanceof HTMLAnchorElement,
  )

  if (
    !(toggle instanceof HTMLButtonElement) ||
    !(panel instanceof HTMLElement) ||
    view === null ||
    toggle.getAttribute('aria-controls') !== panel.id ||
    panel.id === '' ||
    ownerDocument.getElementById(panel.id) !== panel
  ) {
    return false
  }

  let sections = []
  let scrollOffset = 0
  let updateFrame = 0
  let measurementRequired = false
  let anchorCorrectionFrame = 0
  let correctedAnchor = null

  function collectSections() {
    const sectionMap = new Map()

    navigationLinks.forEach((link) => {
      const id = getTargetId(link)
      const element = ownerDocument.getElementById(id)

      if (!(element instanceof HTMLElement)) {
        return
      }

      if (!sectionMap.has(id)) {
        sectionMap.set(id, { id, element, top: 0, links: [] })
      }

      sectionMap.get(id).links.push(link)
    })

    sections = Array.from(sectionMap.values())
  }

  function getScrollOffset() {
    const tokenValue = view.getComputedStyle(documentElement).getPropertyValue('--scroll-offset').trim()

    if (tokenValue === '') {
      return 0
    }

    const measurement = ownerDocument.createElement('div')
    measurement.style.position = 'absolute'
    measurement.style.visibility = 'hidden'
    measurement.style.pointerEvents = 'none'
    measurement.style.blockSize = tokenValue
    ownerDocument.body.append(measurement)

    const value = measurement.getBoundingClientRect().height
    measurement.remove()
    return value
  }

  function measureSections() {
    scrollOffset = getScrollOffset()

    sections.forEach((section) => {
      section.top = section.element.getBoundingClientRect().top + view.scrollY
    })

    sections.sort((first, second) => first.top - second.top)
  }

  function observeSectionLayout() {
    if (typeof view.ResizeObserver !== 'function') {
      return
    }

    const sectionElements = new Set(
      sections.map((section) => section.element.closest('section')).filter(Boolean),
    )
    const layoutObserver = new view.ResizeObserver(() => scheduleUpdate(true))

    sectionElements.forEach((section) => layoutObserver.observe(section))
  }

  function determineActiveSection() {
    if (sections.length === 0) {
      return null
    }

    if (Math.ceil(view.innerHeight + view.scrollY) >= documentElement.scrollHeight) {
      return sections.at(-1)
    }

    const activationPosition = view.scrollY + scrollOffset
    let activeSection = sections[0]

    sections.forEach((section) => {
      if (section.top <= activationPosition) {
        activeSection = section
      }
    })

    return activeSection
  }

  function applyActiveSection(activeSection) {
    sections.forEach((section) => {
      section.links.forEach((link) => {
        if (section === activeSection) {
          link.setAttribute('aria-current', 'location')
        } else {
          link.removeAttribute('aria-current')
        }
      })
    })
  }

  function updateActiveSection() {
    if (measurementRequired) {
      measureSections()
      measurementRequired = false
    }

    applyActiveSection(determineActiveSection())
  }

  function scheduleUpdate(shouldMeasure = false) {
    measurementRequired ||= shouldMeasure

    if (updateFrame !== 0) {
      return
    }

    updateFrame = view.requestAnimationFrame(() => {
      updateFrame = 0
      updateActiveSection()
    })
  }

  function scheduleAnchorCorrection(link) {
    const targetId = getTargetId(link)
    const targetSection = sections.find((section) => section.id === targetId)

    if (targetSection === undefined) {
      return
    }

    if (anchorCorrectionFrame !== 0) {
      view.cancelAnimationFrame(anchorCorrectionFrame)
    }

    const initialScrollPosition = view.scrollY
    let previousScrollPosition = initialScrollPosition
    let stableFrames = 0

    function reconcileAnchorPosition() {
      const maximumScrollPosition = Math.max(
        documentElement.scrollHeight - view.innerHeight,
        0,
      )
      const nativeScrollPosition = Math.min(
        Math.max(targetSection.top - scrollOffset, 0),
        maximumScrollPosition,
      )
      const currentScrollPosition = view.scrollY
      const hasSettled = currentScrollPosition === previousScrollPosition
      const reachedNativePosition = Math.abs(currentScrollPosition - nativeScrollPosition) < 1
      const remainsAtPreviousCorrection =
        correctedAnchor?.id === targetId &&
        initialScrollPosition === correctedAnchor.scrollPosition &&
        currentScrollPosition === correctedAnchor.scrollPosition

      stableFrames = hasSettled ? stableFrames + 1 : 0
      previousScrollPosition = currentScrollPosition

      if (stableFrames >= 2 && remainsAtPreviousCorrection) {
        anchorCorrectionFrame = 0
        return
      }

      if (stableFrames >= 2 && reachedNativePosition) {
        view.scrollBy({ top: anchorCorrection, behavior: 'instant' })
        correctedAnchor = { id: targetId, scrollPosition: view.scrollY }
        anchorCorrectionFrame = 0
        scheduleUpdate()
        return
      }

      anchorCorrectionFrame = view.requestAnimationFrame(reconcileAnchorPosition)
    }

    anchorCorrectionFrame = view.requestAnimationFrame(reconcileAnchorPosition)
  }

  function cancelAnchorCorrection() {
    if (anchorCorrectionFrame === 0) {
      return
    }

    view.cancelAnimationFrame(anchorCorrectionFrame)
    anchorCorrectionFrame = 0
  }

  function setToggleState(expanded) {
    toggle.setAttribute('aria-expanded', String(expanded))
    toggle.setAttribute('aria-label', `${expanded ? 'Close' : 'Open'} navigation`)
  }

  function openPanel() {
    if (!panel.hidden) {
      return
    }

    panel.hidden = false
    setToggleState(true)
    navigationLinks.find((link) => link.getClientRects().length > 0)?.focus()
  }

  function closePanel(restoreFocus = true) {
    if (panel.hidden) {
      return
    }

    panel.hidden = true
    setToggleState(false)

    if (restoreFocus && toggle.isConnected) {
      toggle.focus()
    }
  }

  toggle.addEventListener('click', () => {
    if (panel.hidden) {
      openPanel()
    } else {
      closePanel()
    }
  })

  ownerDocument.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) {
      closePanel()
    }
  })

  navigationLinks.forEach((link) => {
    link.addEventListener('click', () => {
      scheduleUpdate()
      scheduleAnchorCorrection(link)
    })
  })

  view.addEventListener('scroll', () => scheduleUpdate(), { passive: true })
  view.addEventListener('wheel', cancelAnchorCorrection, { passive: true })
  view.addEventListener('touchstart', cancelAnchorCorrection, { passive: true })
  ownerDocument.addEventListener('pointerdown', cancelAnchorCorrection)
  view.addEventListener('hashchange', () => scheduleUpdate(true))
  view.addEventListener('resize', () => {
    if (toggle.getClientRects().length === 0) {
      closePanel(false)
    }

    scheduleUpdate(true)
  })

  if (ownerDocument.readyState === 'complete') {
    scheduleUpdate(true)
  } else {
    view.addEventListener('load', () => scheduleUpdate(true), { once: true })
  }

  ownerDocument.fonts?.ready.then(() => scheduleUpdate(true))

  panel.hidden = true
  setToggleState(false)
  toggle.hidden = false
  collectSections()
  measureSections()
  updateActiveSection()
  observeSectionLayout()

  initializedRoots.add(root)
  return true
}

export function initPlaygroundNavigations(scope = document) {
  return getRoots(scope).map(initPlaygroundNavigation)
}
