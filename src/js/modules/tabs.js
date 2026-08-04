const tabsRootSelector = '[data-tabs]'
const tabsListSelector = '[data-tabs-list]'
const tabSelector = '[data-tabs-tab]'
const panelSelector = '[data-tabs-panel]'

function getOwnedElements(root, selector) {
  return [...root.querySelectorAll(selector)].filter(
    (element) => element.closest(tabsRootSelector) === root,
  )
}

function collectTabPairs(root) {
  const ownerDocument = root.ownerDocument
  const lists = getOwnedElements(root, tabsListSelector)
  const panels = getOwnedElements(root, panelSelector)

  if (lists.length !== 1) {
    return null
  }

  const list = lists[0]
  const tabs = getOwnedElements(root, tabSelector).filter((tab) => list.contains(tab))

  if (
    !(list instanceof HTMLElement) ||
    list.getAttribute('role') !== 'tablist' ||
    tabs.length === 0 ||
    tabs.length !== panels.length
  ) {
    return null
  }

  const pairedPanels = new Set()
  const pairs = tabs.map((tab) => {
    if (!(tab instanceof HTMLButtonElement) || tab.getAttribute('role') !== 'tab' || tab.id === '') {
      return null
    }

    const panelId = tab.getAttribute('aria-controls')
    const panel = panels.find((candidate) => candidate.id === panelId)

    if (
      panelId === null ||
      !(panel instanceof HTMLElement) ||
      panel.id === '' ||
      panel.getAttribute('role') !== 'tabpanel' ||
      panel.getAttribute('aria-labelledby') !== tab.id ||
      ownerDocument.getElementById(tab.id) !== tab ||
      ownerDocument.getElementById(panelId) !== panel ||
      pairedPanels.has(panel)
    ) {
      return null
    }

    pairedPanels.add(panel)
    return { tab, panel }
  })

  if (pairs.some((pair) => pair === null)) {
    return null
  }

  return { list, pairs }
}

function syncTabState(pairs, activeTab) {
  pairs.forEach(({ tab, panel }) => {
    const active = tab === activeTab
    tab.setAttribute('aria-selected', String(active))
    tab.tabIndex = active ? 0 : -1
    panel.hidden = !active
  })
}

function getInitialTab(pairs) {
  return pairs.find(({ tab }) => tab.getAttribute('aria-selected') === 'true')?.tab ?? pairs[0].tab
}

export function initTabsRoot(root) {
  if (!(root instanceof HTMLElement) || root.hasAttribute('data-tabs-enhanced')) {
    return root instanceof HTMLElement && root.hasAttribute('data-tabs-enhanced')
  }

  const collection = collectTabPairs(root)

  if (collection === null) {
    return false
  }

  const { list, pairs } = collection
  const tabs = pairs.map(({ tab }) => tab)
  const orientation = root.dataset.tabsOrientation === 'vertical' ? 'vertical' : 'horizontal'
  const activation = root.dataset.tabsActivation === 'manual' ? 'manual' : 'automatic'

  if (orientation === 'vertical') {
    list.setAttribute('aria-orientation', 'vertical')
  } else {
    list.removeAttribute('aria-orientation')
  }

  tabs.forEach((tab) => {
    tab.disabled = false
  })

  syncTabState(pairs, getInitialTab(pairs))

  function activateTab(tab) {
    if (tabs.includes(tab)) {
      syncTabState(pairs, tab)
    }
  }

  function focusTab(tab, activate = activation === 'automatic') {
    tab.focus()

    if (activate) {
      activateTab(tab)
    } else {
      tabs.forEach((candidate) => {
        candidate.tabIndex = candidate === tab ? 0 : -1
      })
    }
  }

  list.addEventListener('click', (event) => {
    const tab = event.target instanceof Element ? event.target.closest(tabSelector) : null

    if (tab instanceof HTMLButtonElement && tabs.includes(tab)) {
      activateTab(tab)
    }
  })

  list.addEventListener('keydown', (event) => {
    const currentTab = event.target instanceof HTMLButtonElement ? event.target : null
    const currentIndex = currentTab === null ? -1 : tabs.indexOf(currentTab)

    if (currentIndex === -1) {
      return
    }

    const previousKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft'
    const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight'
    let targetIndex = null

    if (event.key === previousKey) {
      targetIndex = (currentIndex - 1 + tabs.length) % tabs.length
    } else if (event.key === nextKey) {
      targetIndex = (currentIndex + 1) % tabs.length
    } else if (event.key === 'Home') {
      targetIndex = 0
    } else if (event.key === 'End') {
      targetIndex = tabs.length - 1
    } else if (activation === 'manual' && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault()
      activateTab(currentTab)
      return
    }

    if (targetIndex !== null) {
      event.preventDefault()
      focusTab(tabs[targetIndex])
    }
  })

  root.dataset.tabsEnhanced = ''
  return true
}

export function initTabs(scope = document) {
  const roots = scope.querySelectorAll(tabsRootSelector)
  roots.forEach(initTabsRoot)
}
