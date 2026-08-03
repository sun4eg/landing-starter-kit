const rootSelector = '[data-range-slider]'
const inputSelector = '[data-range-slider-input]'
const outputSelector = '[data-range-slider-output]'

const initializedRoots = new WeakSet()

function getConstraint(input, name, fallback) {
  const attributeValue = input.getAttribute(name)

  if (attributeValue === null || attributeValue === '') {
    return fallback
  }

  const value = Number(attributeValue)
  return Number.isFinite(value) ? value : fallback
}

function initRangeSlider(root) {
  if (initializedRoots.has(root)) {
    return true
  }

  const ownerDocument = root.ownerDocument
  const input = root.querySelector(inputSelector)
  const output = root.querySelector(outputSelector)

  if (
    !(input instanceof HTMLInputElement) ||
    input.type !== 'range' ||
    input.id === '' ||
    ownerDocument.getElementById(input.id) !== input ||
    (output !== null &&
      (!(output instanceof HTMLOutputElement) ||
        !output.getAttribute('for')?.split(/\s+/).includes(input.id)))
  ) {
    return false
  }

  const suffix = root.dataset.rangeSliderSuffix ?? ''

  function synchronizePresentation() {
    const minimum = getConstraint(input, 'min', 0)
    const maximum = getConstraint(input, 'max', 100)
    const value = input.valueAsNumber
    const range = maximum - minimum
    const rawProgress = range > 0 && Number.isFinite(value) ? ((value - minimum) / range) * 100 : 0
    const progress = Math.min(100, Math.max(0, rawProgress))

    input.style.setProperty('--range-slider-progress', `${progress}%`)

    if (output instanceof HTMLOutputElement) {
      output.textContent = `${input.value}${suffix}`
    }
  }

  input.addEventListener('input', synchronizePresentation)
  synchronizePresentation()
  initializedRoots.add(root)
  return true
}

export function initRangeSliders(scope = document) {
  const roots = scope.querySelectorAll(rootSelector)
  roots.forEach(initRangeSlider)
}
