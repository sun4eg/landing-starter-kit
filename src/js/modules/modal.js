const modalSelector = '[data-modal]'
const dialogSelector = '[data-modal-dialog]'
const openSelector = '[data-modal-open]'
const closeSelector = '[data-modal-close]'
const focusableSelector = [
  'a[href]',
  'button:not(:disabled)',
  'input:not(:disabled)',
  'select:not(:disabled)',
  'textarea:not(:disabled)',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

let activeInstance = null

function collectIsolationTargets(root) {
  const targets = []
  let branch = root

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

    if (parent === root.ownerDocument.body) {
      break
    }

    branch = parent
  }

  return targets
}

function applyModalIsolation(root) {
  const isolationStates = new Map()

  try {
    collectIsolationTargets(root).forEach((element) => {
      isolationStates.set(element, element.inert)

      if (!element.inert) {
        element.inert = true
      }
    })
  } catch (error) {
    restoreModalIsolation(isolationStates)
    throw error
  }

  return isolationStates
}

function restoreModalIsolation(isolationStates) {
  isolationStates.forEach((wasInert, element) => {
    element.inert = wasInert
  })
}

function getOwnedElements(root, selector) {
  return [...root.querySelectorAll(selector)].filter(
    (element) => element.closest(modalSelector) === root,
  )
}

function isVisible(element) {
  return element.getClientRects().length > 0
}

function getFocusableElements(dialog) {
  return [...dialog.querySelectorAll(focusableSelector)].filter(
    (element) => element instanceof HTMLElement && !element.hidden && isVisible(element),
  )
}

function hasValidDialogMarkup(root, dialog, closeButtons) {
  if (
    root.id === '' ||
    root.ownerDocument.getElementById(root.id) !== root ||
    !(dialog instanceof HTMLElement) ||
    dialog.getAttribute('role') !== 'dialog' ||
    dialog.getAttribute('aria-modal') !== 'true' ||
    closeButtons.length === 0 ||
    !closeButtons.every(
      (button) => button instanceof HTMLButtonElement && button.type === 'button',
    )
  ) {
    return false
  }

  const labelledBy = dialog.getAttribute('aria-labelledby')
  const describedBy = dialog.getAttribute('aria-describedby')
  const label = labelledBy === null ? null : root.ownerDocument.getElementById(labelledBy)
  const description = describedBy === null ? null : root.ownerDocument.getElementById(describedBy)

  return (
    labelledBy !== null &&
    label instanceof HTMLElement &&
    root.contains(label) &&
    (describedBy === null || (description instanceof HTMLElement && root.contains(description)))
  )
}

function getOpeners(scope, root) {
  return [...scope.querySelectorAll(openSelector)].filter(
    (opener) =>
      opener instanceof HTMLButtonElement &&
      opener.type === 'button' &&
      opener.dataset.modalOpen === root.id &&
      opener.getAttribute('aria-controls') === root.id,
  )
}

function trapFocus(event, dialog) {
  if (event.key !== 'Tab') {
    return
  }

  const focusable = getFocusableElements(dialog)

  if (focusable.length === 0) {
    event.preventDefault()
    dialog.focus()
    return
  }

  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (event.shiftKey && dialog.ownerDocument.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && dialog.ownerDocument.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

function getInitialFocus(dialog) {
  const autofocusTarget = dialog.querySelector('[autofocus]')
  const focusable = getFocusableElements(dialog)

  return focusable.includes(autofocusTarget) ? autofocusTarget : focusable[0] ?? dialog
}

function getFallbackRestoreTarget(root, openers) {
  const availableOpener = openers.find(
    (opener) => opener.isConnected && !opener.disabled && !opener.inert && isVisible(opener),
  )

  if (availableOpener !== undefined) {
    return availableOpener
  }

  return [...root.ownerDocument.querySelectorAll(focusableSelector)].find(
    (element) =>
      element instanceof HTMLElement &&
      !root.contains(element) &&
      !element.inert &&
      !element.closest('[inert]') &&
      isVisible(element),
  )
}

export function initModalRoot(root, scope = document) {
  if (!(root instanceof HTMLElement) || root.hasAttribute('data-modal-enhanced')) {
    return root instanceof HTMLElement && root.hasAttribute('data-modal-enhanced')
  }

  const dialogs = getOwnedElements(root, dialogSelector)
  const closeButtons = getOwnedElements(root, closeSelector)
  const dialog = dialogs.length === 1 ? dialogs[0] : null
  const openers = getOpeners(scope, root)

  if (!hasValidDialogMarkup(root, dialog, closeButtons) || openers.length === 0) {
    return false
  }

  let returnFocusTarget = null

  function close({ restoreFocus = true } = {}) {
    if (root.hidden) {
      return
    }

    if (activeInstance?.root === root) {
      root.ownerDocument.removeEventListener('focusin', activeInstance.guardFocus, true)
      restoreModalIsolation(activeInstance.isolationStates)
      activeInstance = null
    }

    root.hidden = true
    root.removeAttribute('data-modal-visible')
    root.ownerDocument.documentElement.removeAttribute('data-modal-scroll-lock')

    if (restoreFocus) {
      const restoreTarget =
        returnFocusTarget?.isConnected &&
        !returnFocusTarget.disabled &&
        !returnFocusTarget.inert &&
        !returnFocusTarget.closest('[inert]')
          ? returnFocusTarget
          : getFallbackRestoreTarget(root, openers)

      restoreTarget?.focus()
    }

    returnFocusTarget = null
  }

  function open(opener) {
    if (activeInstance?.root === root) {
      return
    }

    if (activeInstance !== null && activeInstance.root !== root) {
      activeInstance.close({ restoreFocus: false })
    }

    returnFocusTarget = opener
    root.hidden = false
    root.dataset.modalVisible = ''
    root.ownerDocument.documentElement.dataset.modalScrollLock = ''

    let isolationStates = new Map()
    let instance = null

    try {
      isolationStates = applyModalIsolation(root)
      instance = {
        root,
        dialog,
        close,
        isolationStates,
        lastFocused: null,
        guardFocus: null,
      }

      instance.guardFocus = (event) => {
        if (activeInstance !== instance) {
          return
        }

        if (event.target instanceof Node && dialog.contains(event.target)) {
          if (event.target instanceof HTMLElement) {
            instance.lastFocused = event.target
          }
          return
        }

        const focusTarget =
          instance.lastFocused?.isConnected && dialog.contains(instance.lastFocused)
            ? instance.lastFocused
            : getInitialFocus(dialog)

        focusTarget.focus()
      }

      activeInstance = instance
      root.ownerDocument.addEventListener('focusin', instance.guardFocus, true)
      getInitialFocus(dialog).focus()
    } catch {
      if (instance !== null) {
        root.ownerDocument.removeEventListener('focusin', instance.guardFocus, true)
      }
      restoreModalIsolation(isolationStates)
      if (activeInstance?.root === root) {
        activeInstance = null
      }
      root.hidden = true
      root.removeAttribute('data-modal-visible')
      root.ownerDocument.documentElement.removeAttribute('data-modal-scroll-lock')
      returnFocusTarget = null
    }
  }

  openers.forEach((opener) => {
    opener.hidden = false
    opener.addEventListener('click', () => open(opener))
  })

  closeButtons.forEach((button) => {
    button.addEventListener('click', () => close())
  })

  root.addEventListener('click', (event) => {
    if (event.target === root) {
      close()
    }
  })

  root.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      close()
      return
    }

    trapFocus(event, dialog)
  })

  root.hidden = true
  root.dataset.modalEnhanced = ''
  return true
}

export function initModals(scope = document) {
  const roots = scope.querySelectorAll(modalSelector)
  roots.forEach((root) => initModalRoot(root, scope))
}
