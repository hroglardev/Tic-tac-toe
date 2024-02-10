const inputs = [...document.querySelectorAll('input')]
const startButton = document.querySelector('.start')

const validate = (inputs) => {
  let isValid = true
  inputs.forEach((input) => {
    if (input.value.trim() === '') {
      isValid = false
    }
  })
  return isValid
}

const activateButton = () => {
  const isValid = validate(inputs)
  if (isValid) {
    startButton.removeAttribute('disabled')
  } else {
    startButton.setAttribute('disabled', true)
  }
}

inputs.forEach((input) => {
  input.addEventListener('change', activateButton)
})
