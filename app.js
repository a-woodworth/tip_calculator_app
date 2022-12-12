const tipCalcForm = document.forms['calculator'];
const billAmount = tipCalcForm.elements.bill;
const radioBtnTips = tipCalcForm.elements.tip;
const customTip = tipCalcForm.elements.customTip;
const numberOfPeople = tipCalcForm.elements.people;
const tipAmountText = tipCalcForm.elements.tipAmount;
const totalAmountText = tipCalcForm.elements.total;
const resetBtn = tipCalcForm.elements.resetButton;
let billTotal = 0;
let tipPercentage = 0;
let peopleTotal = 0;

// Custom error messages
const errorMessages = {
  badInputError: `Enter a number`,
  decimalError: `Two decimal spaces only`,
  maxValueError: `Max value = `,
  minValueError: `Min value = `,
  zeroValueError: `Can't be zero`,
}

function activateResetBtn() {
  resetBtn.removeAttribute('disabled');
}

function showCustomTipInput() {
// If custom tip radio button selected, show input field for custom % value
  customTip.classList.remove('not-visible');
  customTip.classList.add('visible');
  customTip.focus();
}

function resetCustomTipInput() {
// Return custom tip radio button to default settings  
  customTip.classList.remove('visible');
  customTip.classList.add('not-visible');
  customTip.value = '';
}

function showError(message) {
  message.classList.remove('not-visible');
  message.classList.add('visible');
}

function removeError(message) {
  message.classList.remove('visible');
  message.classList.add('not-visible');
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
  if ( validity.stepMismatch ) {
    return `${errorMessages.decimalError}`;
  }
}

// Format split to US dollars
function numberToCurrency(amount) {
  const valueAsDollars = {style: 'currency', currency: 'USD', maximumFractionDigits: 2}
  const numberFormat = new Intl.NumberFormat('en-US', valueAsDollars);
  return numberFormat.format(amount);
}


[billAmount, numberOfPeople].forEach(inputField => {
  inputField.addEventListener('click', (e) => {
    // Enable button so bill and people inputs can be reset
    activateResetBtn();
  });

  inputField.addEventListener('change', (e) => {
    // Convert input values
    const billAmountInput = Number(billAmount.value);
    const numberOfPeopleInput = Number(numberOfPeople.value);

    billTotal = billAmountInput;
    peopleTotal = numberOfPeopleInput;
  })
}); 

// Get tip % from radio button
radioBtnTips.forEach(radioBtn => {
  radioBtn.addEventListener('change', () => {
    const radioBtnTipInput = radioBtn.value;

    activateResetBtn();

    // If custom tip selected, show input for custom % value
    if (radioBtnTipInput === '') { 
      showCustomTipInput();
      tipPercentage = 0;
    } else {
      // Hide custom input; Return to radio button value
      resetCustomTipInput();
      tipPercentage = Number(radioBtnTipInput);
      tipPercentage = tipPercentage / 100;
    }
  });
});

// If custom tip exists, get tip % value
customTip.addEventListener('change', () => {
  const customTipInput = Number(customTip.value);
  tipPercentage = customTipInput;
  tipPercentage = tipPercentage / 100;
});

// Reset form
resetBtn.addEventListener('click', () => {
  tipCalcForm.reset();
  resetCustomTipInput();
  tipPercentage = 0;
  resetBtn.setAttribute('disabled', '');
});

// Validate Inputs
function validateInputs(e) {
  const input = e.target;
  const inputID = e.target.id;
  const errorMessageSpan = document.getElementById(`${inputID}-input-error`);

  const isValid = e.target.checkValidity();

  if (!isValid) {
    const message = getErrorMessage(input);
    input.classList.add('invalid');
    input.setAttribute('aria-invalid', true);
    showError(errorMessageSpan);
    errorMessageSpan.textContent = message || input.validationMessage;
  } 
  else {
    input.classList.remove('invalid');
    input.setAttribute('aria-invalid', false);
    removeError(errorMessageSpan);
    errorMessageSpan.textContent = '';
  }
}

// Calculate Split
function calculateTip(e) {
  // Get numbers from inputs, including custom tip if selected
  const inputs = [...document.querySelectorAll('input[type="number"]')];
  
  inputs.forEach((input) => {
    input.addEventListener('blur', (e) => {
      validateInputs(e);
    });
  });
}

tipCalcForm.addEventListener('click', calculateTip);
tipCalcForm.addEventListener('input', calculateTip);
