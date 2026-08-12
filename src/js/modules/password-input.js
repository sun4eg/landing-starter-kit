const rootSelector = '[data-password-input]'
const controlSelector = '[data-password-input-control]'
const toggleSelector = '[data-password-input-toggle]'

const initializedRoots = new WeakSet()

function initPasswordInput(root) {
  if (initializedRoots.has(root)) {
    return true
  }

  const ownerDocument = root.ownerDocument
  const control = root.querySelector(controlSelector)
  const toggle = root.querySelector(toggleSelector)

  if (
    !(control instanceof HTMLInputElement) ||
    !(toggle instanceof HTMLButtonElement) ||
    control.type !== 'password' ||
    control.id === '' ||
    toggle.type !== 'button' ||
    toggle.getAttribute('aria-controls') !== control.id ||
    ownerDocument.getElementById(control.id) !== control
  ) {
    return false
  }

  const showLabel = toggle.getAttribute('aria-label')?.trim() || 'Show password'
  const hideLabel = /^show\b/i.test(showLabel)
    ? showLabel.replace(/^show\b/i, 'Hide')
    : 'Hide password'

  function setVisible(visible) {
    control.type = visible ? 'text' : 'password'
    toggle.setAttribute('aria-pressed', String(visible))
    toggle.setAttribute('aria-label', visible ? hideLabel : showLabel)
  }

  toggle.addEventListener('click', () => {
    const selectionStart = control.selectionStart
    const selectionEnd = control.selectionEnd
    const selectionDirection = control.selectionDirection

    setVisible(control.type === 'password')

    if (selectionStart !== null && selectionEnd !== null) {
      try {
        control.setSelectionRange(selectionStart, selectionEnd, selectionDirection ?? 'none')
      } catch {
        // Some browsers do not restore selection on an unfocused password control.
      }
    }
  })

  setVisible(false)
  toggle.disabled = control.disabled
  toggle.hidden = false
  initializedRoots.add(root)
  return true
}

export function initPasswordInputs(scope = document) {
  const roots = scope.querySelectorAll(rootSelector)
  roots.forEach(initPasswordInput)
}
