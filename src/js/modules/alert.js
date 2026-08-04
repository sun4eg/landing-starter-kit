const rootSelector = '[data-alert]'
const dismissSelector = '[data-alert-dismiss]'
const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

const initializedRoots = new WeakSet()

function getFocusTarget(root) {
  const candidates = Array.from(root.ownerDocument.querySelectorAll(focusableSelector)).filter(
    (candidate) =>
      candidate instanceof HTMLElement &&
      !root.contains(candidate) &&
      !candidate.hidden &&
      candidate.getClientRects().length > 0,
  )
  const followingTarget = candidates.find(
    (candidate) =>
      root.compareDocumentPosition(candidate) & Node.DOCUMENT_POSITION_FOLLOWING,
  )

  return followingTarget ?? candidates.at(-1) ?? null
}

function initAlert(root) {
  if (initializedRoots.has(root)) {
    return true
  }

  const dismissButton = root.querySelector(dismissSelector)

  if (
    !(dismissButton instanceof HTMLButtonElement) ||
    dismissButton.type !== 'button' ||
    dismissButton.closest(rootSelector) !== root
  ) {
    return false
  }

  dismissButton.addEventListener('click', (event) => {
    const focusTarget = event.detail === 0 ? getFocusTarget(root) : null
    root.remove()
    focusTarget?.focus()
  })

  dismissButton.hidden = false
  initializedRoots.add(root)
  return true
}

export function initAlerts(scope = document) {
  const roots = scope.querySelectorAll(rootSelector)
  roots.forEach(initAlert)
}
