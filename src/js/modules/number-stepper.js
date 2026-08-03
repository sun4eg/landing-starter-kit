const rootSelector = '[data-number-stepper]'
const inputSelector = '[data-number-stepper-input]'
const decrementSelector = '[data-number-stepper-decrement]'
const incrementSelector = '[data-number-stepper-increment]'

const initializedRoots = new WeakSet()

function getNumericConstraint(input, attributeName) {
  const attributeValue = input.getAttribute(attributeName)

  if (attributeValue === null || attributeValue === '') {
    return null
  }

  const numericValue = Number(attributeValue)
  return Number.isFinite(numericValue) ? numericValue : null
}

function initNumberStepper(root) {
  if (initializedRoots.has(root)) {
    return true
  }

  const ownerDocument = root.ownerDocument
  const input = root.querySelector(inputSelector)
  const decrementButton = root.querySelector(decrementSelector)
  const incrementButton = root.querySelector(incrementSelector)

  if (
    !(input instanceof HTMLInputElement) ||
    !(decrementButton instanceof HTMLButtonElement) ||
    !(incrementButton instanceof HTMLButtonElement) ||
    input.type !== 'number' ||
    input.id === '' ||
    decrementButton.type !== 'button' ||
    incrementButton.type !== 'button' ||
    decrementButton.getAttribute('aria-controls') !== input.id ||
    incrementButton.getAttribute('aria-controls') !== input.id ||
    ownerDocument.getElementById(input.id) !== input
  ) {
    return false
  }

  function synchronizeButtons() {
    const preventsStepping = input.disabled || input.readOnly
    const value = input.valueAsNumber
    const minimum = getNumericConstraint(input, 'min')
    const maximum = getNumericConstraint(input, 'max')
    const hasNumericValue = Number.isFinite(value)

    decrementButton.disabled =
      preventsStepping || (hasNumericValue && minimum !== null && value <= minimum)
    incrementButton.disabled =
      preventsStepping || (hasNumericValue && maximum !== null && value >= maximum)
  }

  function stepInput(direction) {
    const previousValue = input.value

    try {
      if (direction === 'increment') {
        input.stepUp()
      } else {
        input.stepDown()
      }
    } catch {
      synchronizeButtons()
      return
    }

    if (input.value === previousValue) {
      synchronizeButtons()
      return
    }

    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
    synchronizeButtons()
  }

  decrementButton.addEventListener('click', () => stepInput('decrement'))
  incrementButton.addEventListener('click', () => stepInput('increment'))
  input.addEventListener('input', synchronizeButtons)
  input.addEventListener('change', synchronizeButtons)

  synchronizeButtons()
  decrementButton.hidden = false
  incrementButton.hidden = false
  root.dataset.numberStepperEnhanced = ''
  initializedRoots.add(root)
  return true
}

export function initNumberSteppers(scope = document) {
  const roots = scope.querySelectorAll(rootSelector)
  roots.forEach(initNumberStepper)
}
