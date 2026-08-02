const navigationSelector = '[data-navigation]'
const toggleSelector = '[data-navigation-toggle]'
const menuSelector = '[data-navigation-menu]'

function initNavigation(navigation) {
  if (navigation.hasAttribute('data-navigation-enhanced')) {
    return true
  }

  const toggle = navigation.querySelector(toggleSelector)
  const menu = navigation.querySelector(menuSelector)
  const view = navigation.ownerDocument.defaultView

  if (!(toggle instanceof HTMLButtonElement) || !(menu instanceof HTMLElement) || view === null) {
    return false
  }

  if (
    toggle.getAttribute('aria-controls') !== menu.id ||
    menu.id === '' ||
    document.getElementById(menu.id) !== menu
  ) {
    return false
  }

  function setExpanded(expanded, returnFocus = false) {
    toggle.setAttribute('aria-expanded', String(expanded))
    toggle.setAttribute('aria-label', `${expanded ? 'Close' : 'Open'} primary navigation`)
    navigation.toggleAttribute('data-navigation-open', expanded)

    if (returnFocus) {
      toggle.focus()
    }
  }

  toggle.addEventListener('click', () => {
    setExpanded(toggle.getAttribute('aria-expanded') !== 'true')
  })

  menu.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a')) {
      setExpanded(false)
    }
  })

  navigation.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setExpanded(false, true)
    }
  })

  view.addEventListener('resize', () => {
    if (toggle.getAttribute('aria-expanded') === 'true' && toggle.getClientRects().length === 0) {
      setExpanded(false)
    }
  })

  setExpanded(false)
  toggle.hidden = false
  navigation.dataset.navigationEnhanced = ''
  return true
}

export function initNavigations(scope = document) {
  const navigations = scope.querySelectorAll(navigationSelector)
  navigations.forEach(initNavigation)
}
