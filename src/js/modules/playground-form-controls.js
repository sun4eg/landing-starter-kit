const indeterminateSelector = '[data-playground-checkbox-indeterminate]'
const demoFormSelector = 'form[data-playground-form-demo]'
const initializedDemoForms = new WeakSet()

function initDemoForm(form) {
  if (!(form instanceof HTMLFormElement) || initializedDemoForms.has(form)) {
    return
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault()
  })

  initializedDemoForms.add(form)
}

export function initPlaygroundFormControls(scope = document) {
  const indeterminateCheckboxes = scope.querySelectorAll(indeterminateSelector)

  indeterminateCheckboxes.forEach((input) => {
    if (input instanceof HTMLInputElement && input.type === 'checkbox') {
      input.indeterminate = true
    }
  })

  scope.querySelectorAll(demoFormSelector).forEach(initDemoForm)
}
