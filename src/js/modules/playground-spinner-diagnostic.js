// Temporary Android animation diagnostic. Remove with its Playground specimen.
const rootSelector = '[data-spinner-animation-diagnostic]'
const targetSelector = '[data-spinner-diagnostic-target]'
const initializedRoots = new WeakSet()
const sampleInterval = 350
const eventRefreshCount = 8
const eventRefreshInterval = 500

function readPseudo(element, pseudo) {
  const style = getComputedStyle(element, pseudo)

  return [
    `content ${style.content}`,
    `size ${style.width} × ${style.height}`,
    `top ${style.top}`,
    `right ${style.right}`,
    `bottom ${style.bottom}`,
    `left ${style.left}`,
  ].join('; ')
}

function readState(element) {
  const style = getComputedStyle(element)

  return {
    animationName: style.animationName,
    duration: style.animationDuration,
    iterations: style.animationIterationCount,
    playState: style.animationPlayState,
    rotate: style.rotate,
    transform: style.transform,
    display: style.display,
    boxSizing: style.boxSizing,
    width: style.width,
    height: style.height,
  }
}

function createField(term, value, attributes = {}) {
  const fragment = document.createDocumentFragment()
  const name = document.createElement('dt')
  const description = document.createElement('dd')

  name.textContent = term
  description.textContent = value
  Object.entries(attributes).forEach(([attribute, attributeValue]) => {
    description.setAttribute(attribute, attributeValue)
  })
  fragment.append(name, description)

  return fragment
}

function renderResult(container, diagnostic) {
  const card = document.createElement('article')
  const heading = document.createElement('h5')
  const list = document.createElement('dl')
  const { current, events, label } = diagnostic

  card.className = 'spinner-diagnostic__result'
  heading.textContent = label
  list.append(
    createField('advancing', diagnostic.advancing ? 'YES' : 'NO', {
      'data-advancing': String(diagnostic.advancing),
    }),
    createField('animation', current.animationName),
    createField('duration', current.duration),
    createField('iterations', current.iterations),
    createField('play state', current.playState),
    createField('rotate', current.rotate),
    createField('transform', current.transform),
    createField('display', current.display),
    createField('box sizing', current.boxSizing),
    createField('size', `${current.width} × ${current.height}`),
    createField('started event', events.started ? 'yes' : 'no'),
    createField('iteration events', String(events.iterations)),
    createField('cancelled event', events.cancelled ? 'yes' : 'no'),
  )

  if (label === 'A' || label === 'B') {
    list.append(
      createField('::before', readPseudo(diagnostic.element, '::before')),
      createField('::after', readPseudo(diagnostic.element, '::after')),
    )
  }

  card.append(heading, list)
  container.append(card)
}

function render(root, diagnostics) {
  const container = root.querySelector('[data-spinner-diagnostic-results]')

  if (!container) {
    return
  }

  container.replaceChildren()
  diagnostics.forEach((diagnostic) => renderResult(container, diagnostic))
}

function recordEvents(diagnostic) {
  diagnostic.element.addEventListener('animationstart', () => {
    diagnostic.events.started = true
  })
  diagnostic.element.addEventListener('animationiteration', () => {
    diagnostic.events.iterations = Math.min(diagnostic.events.iterations + 1, 999)
  })
  diagnostic.element.addEventListener('animationcancel', () => {
    diagnostic.events.cancelled = true
  })
}

function sample(root, diagnostics, button) {
  const initial = diagnostics.map(({ element }) => readState(element))

  button.disabled = true
  window.setTimeout(() => {
    diagnostics.forEach((diagnostic, index) => {
      const current = readState(diagnostic.element)
      diagnostic.current = current
      diagnostic.advancing = current.rotate !== initial[index].rotate
        || current.transform !== initial[index].transform
    })
    render(root, diagnostics)
    button.disabled = false

    let refreshes = 0
    const refreshTimer = window.setInterval(() => {
      diagnostics.forEach((diagnostic) => {
        diagnostic.current = readState(diagnostic.element)
      })
      render(root, diagnostics)
      refreshes += 1

      if (refreshes >= eventRefreshCount) {
        window.clearInterval(refreshTimer)
      }
    }, eventRefreshInterval)
  }, sampleInterval)
}

function initDiagnostic(root) {
  if (initializedRoots.has(root)) {
    return
  }

  const button = root.querySelector('[data-spinner-diagnostic-run]')
  const preference = root.querySelector('[data-spinner-diagnostic-preference]')
  const elements = [...root.querySelectorAll(targetSelector)]

  if (!(button instanceof HTMLButtonElement) || !preference || elements.length === 0) {
    return
  }

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
  const diagnostics = elements.map((element) => ({
    element,
    label: element.dataset.spinnerDiagnosticTarget,
    current: readState(element),
    advancing: false,
    events: { started: false, iterations: 0, cancelled: false },
  }))

  preference.textContent = `prefers-reduced-motion: ${reducedMotion}`
  diagnostics.forEach(recordEvents)
  button.addEventListener('click', () => sample(root, diagnostics, button))
  initializedRoots.add(root)
  sample(root, diagnostics, button)
}

document.querySelectorAll(rootSelector).forEach(initDiagnostic)
