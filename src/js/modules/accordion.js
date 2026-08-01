const accordionSelector = '[data-accordion]'
const itemSelector = '[data-accordion-item]'
const triggerSelector = '[data-accordion-trigger]'
const panelSelector = '[data-accordion-panel]'

function getAccordionItems(accordion) {
  return [...accordion.querySelectorAll(itemSelector)].map((item) => ({
    item,
    trigger: item.querySelector(triggerSelector),
    panel: item.querySelector(panelSelector),
  }))
}

function hasValidReferences({ trigger, panel }) {
  if (!(trigger instanceof HTMLButtonElement) || !(panel instanceof HTMLElement)) {
    return false
  }

  const panelId = trigger.getAttribute('aria-controls')
  const triggerId = trigger.id

  return (
    panelId !== null &&
    triggerId !== '' &&
    panel.id === panelId &&
    panel.getAttribute('aria-labelledby') === triggerId &&
    document.getElementById(panelId) === panel &&
    document.getElementById(triggerId) === trigger
  )
}

function setItemExpanded({ trigger, panel }, expanded) {
  if (!expanded && panel.contains(document.activeElement)) {
    trigger.focus()
  }

  trigger.setAttribute('aria-expanded', String(expanded))
  panel.hidden = !expanded
}

function initAccordion(accordion) {
  if (accordion.hasAttribute('data-accordion-enhanced')) {
    return true
  }

  const items = getAccordionItems(accordion)

  if (items.length === 0 || !items.every(hasValidReferences)) {
    return false
  }

  const allowsMultiple = accordion.dataset.accordionMultiple === 'true'

  items.forEach((currentItem, index) => {
    currentItem.trigger.disabled = false
    setItemExpanded(currentItem, index === 0)

    currentItem.trigger.addEventListener('click', () => {
      const willExpand = currentItem.trigger.getAttribute('aria-expanded') !== 'true'

      if (willExpand && !allowsMultiple) {
        items.forEach((item) => {
          if (item !== currentItem) {
            setItemExpanded(item, false)
          }
        })
      }

      setItemExpanded(currentItem, willExpand)
    })
  })

  accordion.dataset.accordionEnhanced = ''
  return true
}

export function initAccordions(scope = document) {
  const accordions = scope.querySelectorAll(accordionSelector)
  accordions.forEach(initAccordion)
}
