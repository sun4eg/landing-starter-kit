const isolationRecords = new WeakMap()

export function applyIsolation(owner, targets) {
  const ownedTargets = new Set()

  try {
    targets.forEach((element) => {
      if (!(element instanceof HTMLElement) || ownedTargets.has(element)) {
        return
      }

      let record = isolationRecords.get(element)

      if (record === undefined) {
        record = { initialInert: element.inert, owners: new Set() }
        isolationRecords.set(element, record)
      }

      record.owners.add(owner)
      element.inert = true
      ownedTargets.add(element)
    })
  } catch (error) {
    releaseIsolation(owner, ownedTargets)
    throw error
  }

  return ownedTargets
}

export function releaseIsolation(owner, targets) {
  targets.forEach((element) => {
    const record = isolationRecords.get(element)

    if (record === undefined || !record.owners.delete(owner)) {
      return
    }

    if (record.owners.size === 0) {
      element.inert = record.initialInert
      isolationRecords.delete(element)
    }
  })
}
