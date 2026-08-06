import { applyIsolation, releaseIsolation } from '../utils/isolation.js'

const navigationSelector = '[data-navigation]'
const toggleSelector = '[data-navigation-toggle]'
const menuSelector = '[data-navigation-menu]'
const focusableSelector = [
  'a[href]',
  'button:not(:disabled)',
  'input:not(:disabled)',
  'select:not(:disabled)',
  'textarea:not(:disabled)',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

const instances = new WeakMap()
const openInstances = new Set()

function isVisible(element) {
  return element.getClientRects().length > 0
}

function getFocusableElements(navigation) {
  return [...navigation.querySelectorAll(focusableSelector)].filter(
    (element) =>
      element instanceof HTMLElement &&
      !element.hidden &&
      !element.inert &&
      !element.closest('[inert]') &&
      isVisible(element),
  )
}

function collectIsolationTargets(navigation) {
  const targets = []
  let branch = navigation

  while (branch.parentElement !== null) {
    const parent = branch.parentElement

    for (const element of parent.children) {
      if (
        element !== branch &&
        element instanceof HTMLElement &&
        !element.matches('script, style, template, link, meta')
      ) {
        targets.push(element)
      }
    }

    if (parent === navigation.ownerDocument.body) {
      break
    }

    branch = parent
  }

  return targets
}

function hasInertAncestor(element) {
  return element.inert || element.closest('[inert]') !== null
}

function trapFocus(event, navigation) {
  if (event.key !== 'Tab') {
    return
  }

  const focusable = getFocusableElements(navigation)

  if (focusable.length === 0) {
    event.preventDefault()
    return
  }

  const first = focusable[0]
  const last = focusable.at(-1)
  const activeElement = navigation.ownerDocument.activeElement

  if (event.shiftKey && activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

function initNavigation(navigation) {
  if (instances.has(navigation)) {
    return true
  }

  const toggle = navigation.querySelector(toggleSelector)
  const menu = navigation.querySelector(menuSelector)
  const ownerDocument = navigation.ownerDocument
  const documentElement = ownerDocument.documentElement
  const view = ownerDocument.defaultView

  if (!(toggle instanceof HTMLButtonElement) || !(menu instanceof HTMLElement) || view === null) {
    return false
  }

  if (
    toggle.getAttribute('aria-controls') !== menu.id ||
    menu.id === '' ||
    ownerDocument.getElementById(menu.id) !== menu
  ) {
    return false
  }

  const isolationOwner = {}
  let isolationTargets = new Set()
  let guardFocus = null
  let lastFocused = null
  let instance = null
  let hadScrollLock = false

  function close({ restoreFocus = false, resize = false } = {}) {
    if (toggle.getAttribute('aria-expanded') !== 'true') {
      return
    }

    if (guardFocus !== null) {
      ownerDocument.removeEventListener('focusin', guardFocus, true)
      guardFocus = null
    }

    releaseIsolation(isolationOwner, isolationTargets)
    isolationTargets = new Set()
    if (!hadScrollLock) {
      documentElement.removeAttribute('data-navigation-scroll-lock')
    }
    openInstances.delete(instance)

    toggle.setAttribute('aria-expanded', 'false')
    toggle.setAttribute('aria-label', 'Open primary navigation')
    navigation.removeAttribute('data-navigation-open')

    if (restoreFocus && toggle.isConnected && isVisible(toggle) && !hasInertAncestor(toggle)) {
      toggle.focus()
    } else if (resize && ownerDocument.activeElement === toggle) {
      getFocusableElements(navigation).find((element) => element !== toggle)?.focus()
    }

    lastFocused = null
    hadScrollLock = false
  }

  function open() {
    if (
      toggle.getAttribute('aria-expanded') === 'true' ||
      !isVisible(toggle) ||
      hasInertAncestor(navigation)
    ) {
      return
    }

    openInstances.forEach((openInstance) => {
      if (openInstance !== instance) {
        openInstance.close()
      }
    })

    hadScrollLock = documentElement.hasAttribute('data-navigation-scroll-lock')

    try {
      isolationTargets = applyIsolation(isolationOwner, collectIsolationTargets(navigation))
      documentElement.dataset.navigationScrollLock = ''
      toggle.setAttribute('aria-expanded', 'true')
      toggle.setAttribute('aria-label', 'Close primary navigation')
      navigation.dataset.navigationOpen = ''

      guardFocus = (event) => {
        if (!openInstances.has(instance)) {
          return
        }

        if (event.target instanceof Node && navigation.contains(event.target)) {
          if (event.target instanceof HTMLElement) {
            lastFocused = event.target
          }
          return
        }

        const focusTarget =
          lastFocused?.isConnected && navigation.contains(lastFocused) && isVisible(lastFocused)
            ? lastFocused
            : toggle

        focusTarget.focus()
      }

      openInstances.add(instance)
      ownerDocument.addEventListener('focusin', guardFocus, true)
    } catch {
      if (guardFocus !== null) {
        ownerDocument.removeEventListener('focusin', guardFocus, true)
      }
      releaseIsolation(isolationOwner, isolationTargets)
      isolationTargets = new Set()
      if (!hadScrollLock) {
        documentElement.removeAttribute('data-navigation-scroll-lock')
      }
      openInstances.delete(instance)
      toggle.setAttribute('aria-expanded', 'false')
      toggle.setAttribute('aria-label', 'Open primary navigation')
      navigation.removeAttribute('data-navigation-open')
      guardFocus = null
      hadScrollLock = false
    }
  }

  instance = { navigation, close }

  toggle.addEventListener('click', () => {
    if (toggle.getAttribute('aria-expanded') === 'true') {
      close({ restoreFocus: true })
    } else {
      open()
    }
  })

  navigation.addEventListener('click', (event) => {
    const link = event.target instanceof Element ? event.target.closest('a') : null

    if (link instanceof HTMLAnchorElement && navigation.contains(link)) {
      close()
    }
  })

  navigation.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      event.preventDefault()
      close({ restoreFocus: true })
      return
    }

    trapFocus(event, navigation)
  })

  view.addEventListener('resize', () => {
    if (toggle.getAttribute('aria-expanded') === 'true' && !isVisible(toggle)) {
      close({ resize: true })
    } else if (
      toggle.getAttribute('aria-expanded') === 'false' &&
      isVisible(toggle) &&
      ownerDocument.activeElement instanceof Element &&
      menu.contains(ownerDocument.activeElement) &&
      !isVisible(ownerDocument.activeElement)
    ) {
      toggle.focus()
    }
  })

  view.addEventListener('pagehide', () => close())

  toggle.setAttribute('aria-expanded', 'false')
  toggle.setAttribute('aria-label', 'Open primary navigation')
  navigation.removeAttribute('data-navigation-open')
  toggle.hidden = false
  navigation.dataset.navigationEnhanced = ''
  instances.set(navigation, instance)
  return true
}

export function initNavigations(scope = document) {
  const navigations = scope.querySelectorAll(navigationSelector)
  navigations.forEach(initNavigation)
}

export function closeOpenNavigations(scope = document) {
  openInstances.forEach((instance) => {
    if (instance.navigation.ownerDocument === scope || scope.contains?.(instance.navigation)) {
      instance.close()
    }
  })
}
