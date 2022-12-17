// Custom error messages and functions
const errorMessages = {
  badInputError: `Enter a number`,
  decimalError: `Two decimal spaces only`,
  maxValueError: `Max value = `,
  minValueError: `Min value = `,
  zeroValueError: `Can't be zero`,
}

function getErrorMessage(input) {
  const validity = input.validity;

  // Can't be letters or blank
  if ( validity.badInput || validity.valueMissing ) {
    return `${errorMessages.badInputError}`;
  }
  // Can't be 0
  if ( Number(input.value) === 0 ) {
    return `${errorMessages.zeroValueError}`;
  }
  // Can't be less than min value
  if ( validity.rangeUnderflow ) {
    return `${errorMessages.minValueError}${input.getAttribute('min')}`;
  }
  // Can't exceed max value
  if ( validity.rangeOverflow ) {
     return `${errorMessages.maxValueError}${input.getAttribute('max')}`;
  }
  // Can't have extra decimal places -- billAmount only
  if ( validity.stepMismatch && input.id === 'bill') {
    return `${errorMessages.decimalError}`;
  } 
}

function clearErrorsOnReset() {
  const activeErrorMessages = document.querySelectorAll('.active');
  const invalidInputs = document.querySelectorAll('.invalid');

  // Remove error message spans and text
  activeErrorMessages.forEach((error) => {
    error.classList.remove('active', 'visible');
    error.classList.add('not-visible');
    error.textContent = '';
  });
  // Remove input error styles and reset aria
  invalidInputs.forEach((input) => {
    input.classList.remove('invalid');
    input.setAttribute('aria-invalid', false);
    input.removeAttribute('aria-live', 'polite');
  });
}

function showInputError(input) {
  const error = document.getElementById(input.id);
  const errorMessageSpan = document.getElementById(`${input.id}-input-error`);

  if ( error.validity.valid === false ) {
    const message = getErrorMessage(input);
    error.classList.add('invalid');
    error.setAttribute('aria-invalid', true);
    error.setAttribute('aria-live', 'polite');

    // Add class to show active error messages
    errorMessageSpan.classList.add('active', 'visible');
    errorMessageSpan.classList.remove('not-visible');
    errorMessageSpan.textContent = message || input.validationMessage;
  }  
}

function removeInputError(input) {
  const error = document.getElementById(input.id);
  const errorMessageSpan = document.getElementById(`${input.id}-input-error`);

  if ( error.validity.valid && error.classList.contains('invalid') ) {
    error.classList.remove('invalid');
    error.setAttribute('aria-invalid', false);
    error.removeAttribute('aria-live', 'polite');
    errorMessageSpan.classList.remove('active', 'visible');
    errorMessageSpan.classList.add('not-visible');
    errorMessageSpan.textContent = '';
  }
}
