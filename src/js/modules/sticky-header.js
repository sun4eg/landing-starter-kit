const stickyHeaderSelector = '[data-sticky-header]'
const enhancedAttribute = 'data-sticky-header-enhanced'
const defaultThreshold = 16

function getThreshold(header) {
  const value = header.dataset.stickyHeaderThreshold?.trim()
  const threshold = Number(value)

  return value !== '' && Number.isFinite(threshold) && threshold >= 0 ? threshold : defaultThreshold
}

export function initStickyHeaders(scope = document) {
  const headers = [...scope.querySelectorAll(stickyHeaderSelector)]
    .filter((header) => !header.hasAttribute(enhancedAttribute))
    .map((header) => ({
      header,
      threshold: getThreshold(header),
      isScrolled: header.classList.contains('is-scrolled'),
    }))

  if (headers.length === 0) {
    return
  }

  let updateRequested = false

  function updateHeaders() {
    const scrollPosition = window.scrollY

    headers.forEach((headerState) => {
      const isScrolled = scrollPosition > headerState.threshold

      if (isScrolled !== headerState.isScrolled) {
        headerState.header.classList.toggle('is-scrolled', isScrolled)
        headerState.isScrolled = isScrolled
      }
    })

    updateRequested = false
  }

  function requestUpdate() {
    if (updateRequested) {
      return
    }

    updateRequested = true
    window.requestAnimationFrame(updateHeaders)
  }

  updateHeaders()
  headers.forEach(({ header }) => header.setAttribute(enhancedAttribute, ''))
  window.addEventListener('scroll', requestUpdate, { passive: true })
}
