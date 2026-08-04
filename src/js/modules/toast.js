const regionSelector = '[data-toast-region]'
const toastSelector = '[data-toast]'
const triggerSelector = '[data-toast-trigger]'
const dismissSelector = '[data-toast-dismiss]'
const focusableSelector =
  'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
const maximumVisibleToasts = 3
const maximumQueuedToasts = 3
const minimumDuration = 5000

function getTemplate(scope, trigger) {
  const targetId = trigger.dataset.toastTarget
  const template = targetId === undefined ? null : scope.getElementById(targetId)

  if (!(template instanceof HTMLTemplateElement) || template.id === '') {
    return null
  }

  const fragment = template.content
  const roots = [...fragment.children]
  const ids = fragment.querySelectorAll('[id]')

  if (roots.length !== 1 || !roots[0].matches(toastSelector) || ids.length > 0) {
    return null
  }

  const toast = roots[0]
  const dismissButtons = toast.querySelectorAll(dismissSelector)
  const hasMeaningfulText = toast.textContent.trim() !== ''

  if (
    !hasMeaningfulText ||
    toast.querySelector(toastSelector) !== null ||
    [...dismissButtons].some(
      (button) =>
        !(button instanceof HTMLButtonElement) ||
        button.type !== 'button' ||
        (button.getAttribute('aria-label')?.trim() ?? '') === '',
    )
  ) {
    return null
  }

  if (getDuration(toast) === null && dismissButtons.length === 0) {
    return null
  }

  return template
}

function getDuration(toast) {
  if (toast.hasAttribute('data-toast-persistent')) {
    return null
  }

  const hasAction = [...toast.querySelectorAll(focusableSelector)].some(
    (element) => !element.matches(dismissSelector),
  )

  if (hasAction) {
    return null
  }

  const duration = Number(toast.dataset.toastDuration)
  return Number.isFinite(duration) && duration >= minimumDuration ? duration : null
}

function getAnimations(element) {
  return typeof element.getAnimations === 'function' ? element.getAnimations() : []
}

export function initToasts(scope = document) {
  const regions = [...scope.querySelectorAll(regionSelector)]
  const region = regions.find(
    (candidate) =>
      candidate instanceof HTMLElement &&
      candidate.getAttribute('aria-live') === 'polite' &&
      (candidate.getAttribute('aria-label')?.trim() ?? '') !== '',
  )

  if (!(region instanceof HTMLElement) || region.hasAttribute('data-toast-enhanced')) {
    return region instanceof HTMLElement && region.hasAttribute('data-toast-enhanced')
  }

  const view = scope.defaultView

  if (view === null) {
    return false
  }

  const active = new Map()
  const queue = []
  let pageHidden = scope.hidden

  function pauseTimer(instance) {
    if (instance.timeout === null) {
      return
    }

    view.clearTimeout(instance.timeout)
    instance.timeout = null
    instance.remaining = Math.max(0, instance.remaining - (view.performance.now() - instance.startedAt))
  }

  function resumeTimer(instance) {
    if (
      instance.duration === null ||
      instance.timeout !== null ||
      instance.hovered ||
      instance.focused ||
      pageHidden ||
      instance.dismissing
    ) {
      return
    }

    if (instance.remaining <= 0) {
      dismiss(instance)
      return
    }

    instance.startedAt = view.performance.now()
    instance.timeout = view.setTimeout(() => dismiss(instance), instance.remaining)
  }

  function showNext() {
    while (active.size < maximumVisibleToasts && queue.length > 0) {
      mount(queue.shift())
    }
  }

  function remove(instance) {
    instance.element.remove()
    active.delete(instance.element)

    showNext()
  }

  function dismiss(instance, { restoreFocus = false } = {}) {
    if (instance.dismissing) {
      return
    }

    pauseTimer(instance)
    instance.dismissing = true

    if (restoreFocus && instance.trigger.isConnected && !instance.trigger.disabled) {
      instance.trigger.focus()
    }

    instance.element.inert = true
    instance.element.setAttribute('aria-hidden', 'true')
    instance.element.dataset.toastExiting = ''

    const animations = getAnimations(instance.element)

    if (animations.length === 0) {
      remove(instance)
      return
    }

    Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
      if (instance.element.isConnected) {
        remove(instance)
      }
    })
  }

  function mount(instance) {
    active.set(instance.element, instance)
    region.append(instance.element)

    instance.element.addEventListener('pointerenter', () => {
      instance.hovered = true
      pauseTimer(instance)
    })

    instance.element.addEventListener('pointerleave', () => {
      instance.hovered = false
      resumeTimer(instance)
    })

    instance.element.addEventListener('focusin', () => {
      instance.focused = true
      pauseTimer(instance)
    })

    instance.element.addEventListener('focusout', (event) => {
      if (!(event.relatedTarget instanceof Node) || !instance.element.contains(event.relatedTarget)) {
        instance.focused = false
        resumeTimer(instance)
      }
    })

    instance.element.addEventListener('click', (event) => {
      const dismissButton = event.target instanceof Element ? event.target.closest(dismissSelector) : null

      if (dismissButton instanceof HTMLButtonElement && instance.element.contains(dismissButton)) {
        dismiss(instance, { restoreFocus: event.detail === 0 })
      }
    })

    resumeTimer(instance)
  }

  function createToast(template, trigger) {
    const fragment = template.content.cloneNode(true)
    const element = fragment.firstElementChild

    if (!(element instanceof HTMLElement)) {
      return
    }

    const duration = getDuration(element)
    const instance = {
      element,
      trigger,
      duration,
      remaining: duration ?? 0,
      startedAt: 0,
      timeout: null,
      hovered: false,
      focused: false,
      dismissing: false,
    }

    if (active.size < maximumVisibleToasts) {
      mount(instance)
    } else if (queue.length < maximumQueuedToasts) {
      queue.push(instance)
    }
  }

  const triggers = [...scope.querySelectorAll(triggerSelector)]

  triggers.forEach((trigger) => {
    if (!(trigger instanceof HTMLButtonElement) || trigger.type !== 'button') {
      return
    }

    const template = getTemplate(scope, trigger)

    if (template === null) {
      return
    }

    trigger.hidden = false
    trigger.addEventListener('click', () => createToast(template, trigger))
  })

  scope.addEventListener('visibilitychange', () => {
    pageHidden = scope.hidden
    active.forEach((instance) => {
      if (pageHidden) {
        pauseTimer(instance)
      } else {
        resumeTimer(instance)
      }
    })
  })

  region.dataset.toastEnhanced = ''
  return true
}
