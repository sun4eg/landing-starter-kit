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

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
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

    root.hidden = true
    root.removeAttribute('data-modal-visible')
    root.ownerDocument.documentElement.removeAttribute('data-modal-scroll-lock')

    if (activeInstance?.root === root) {
      activeInstance = null
    }

    if (restoreFocus && returnFocusTarget?.isConnected && !returnFocusTarget.disabled) {
      returnFocusTarget.focus()
    }

    returnFocusTarget = null
  }

  function open(opener) {
    if (activeInstance !== null && activeInstance.root !== root) {
      activeInstance.close({ restoreFocus: false })
    }

    returnFocusTarget = opener
    root.hidden = false
    root.dataset.modalVisible = ''
    root.ownerDocument.documentElement.dataset.modalScrollLock = ''
    activeInstance = { root, close }

    const autofocusTarget = dialog.querySelector('[autofocus]')
    const focusable = getFocusableElements(dialog)
    const initialFocus = focusable.includes(autofocusTarget) ? autofocusTarget : focusable[0] ?? dialog
    initialFocus.focus()
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
