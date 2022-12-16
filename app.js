const tipCalcForm = document.forms['calculator'];
const billAmount = tipCalcForm.elements.bill;
const radioBtnTips = tipCalcForm.elements.tip;
const customTip = tipCalcForm.elements.customTip;
const numberOfPeople = tipCalcForm.elements.people;
const tipAmount = tipCalcForm.elements.tipAmount;
const totalAmount = tipCalcForm.elements.total;
const resetBtn = tipCalcForm.elements.resetButton;
let  { billTotal, tipPercentage, peopleTotal } = 0;

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

// Format split to US dollars
function numberToCurrency(amount) {
  const valueAsDollars = {style: 'currency', currency: 'USD', maximumFractionDigits: 2}
  const numberFormat = new Intl.NumberFormat('en-US', valueAsDollars);
  return numberFormat.format(amount);
}

function validateInputs() {
  // Get numbers from inputs, including custom tip if selected
  const inputFields = [billAmount, numberOfPeople, customTip];

  inputFields.forEach(input => {
    // Check for invalid number and show error
    input.addEventListener('invalid', () => {
      showInputError(input);
      const message = getErrorMessage(input);
      showInputError(input);
    });

    input.addEventListener('blur', () => {
      input.checkValidity();
    });

    input.addEventListener('input', () => {
      const valid = input.checkValidity();

      if (valid) {
        removeInputError(input);
      }
    });
  });
}

function calculateTotals(bill, tip, people) {
  const initialAmount = bill;
  const totalTip = (initialAmount * tip);
  const totalSplitTip = (totalTip / people);
  const totalSplitBill = (initialAmount + totalTip) / people;

  tipAmount.value = numberToCurrency(totalSplitTip);
  totalAmount.value = numberToCurrency(totalSplitBill);
}

// Reset form
resetBtn.addEventListener('click', () => {
  tipCalcForm.reset();
  resetCustomTipInput();
  clearErrorsOnReset();
  billTotal = 0;
  tipPercentage = 0;
  peopleTotal = 0;
  resetBtn.setAttribute('disabled', '');
});

[billAmount, numberOfPeople].forEach(inputField => {
  inputField.addEventListener('click', activateResetBtn);
  inputField.addEventListener('keyup', activateResetBtn);
}); 

// Get tip % from radio button
radioBtnTips.forEach(radioBtn => {
  radioBtn.addEventListener('change', () => {
    const radioBtnTipInput = radioBtn.value;

    activateResetBtn();
    // If custom tip selected, show input for custom % value
    if ( radioBtnTipInput === '' ) { 
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

tipCalcForm.querySelectorAll('input').forEach(input => {
  input.addEventListener('change', () => {
    const billAmountInput = Number(billAmount.value);
    const numberOfPeopleInput = Number(numberOfPeople.value);
    const currentTipInput = tipPercentage;

    billTotal = billAmountInput;
    peopleTotal = numberOfPeopleInput;

    if ( billTotal >= 1 && peopleTotal >= 2 ) {
      calculateTotals(billTotal, currentTipInput, peopleTotal);
    }
  });
});

validateInputs();
