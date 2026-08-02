const indeterminateSelector = '[data-playground-checkbox-indeterminate]'

export function initPlaygroundFormControls(scope = document) {
  const indeterminateCheckboxes = scope.querySelectorAll(indeterminateSelector)

  indeterminateCheckboxes.forEach((input) => {
    if (input instanceof HTMLInputElement && input.type === 'checkbox') {
      input.indeterminate = true
    }
  })
}
