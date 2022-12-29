const tipCalcForm = document.forms['calculator'];
const billAmount = tipCalcForm.elements.bill;
const radioBtnTips = tipCalcForm.elements.tip;
const customTip = tipCalcForm.elements.customTip;
const numberOfPeople = tipCalcForm.elements.people;
const tipAmount = tipCalcForm.elements.tipAmount;
const totalAmount = tipCalcForm.elements.total;
const resetBtn = tipCalcForm.elements.resetButton;
let { billTotal, tipPercentage, peopleTotal } = 0;

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
  const initialAmount = Math.round(bill * 100);
  const totalTip = Math.round(initialAmount * tip);
  const totalSplitTip = Math.floor(totalTip / people) / 100;
  const totalBill = initialAmount + totalTip;
  const totalSplitBill = Math.round(totalBill / people) / 100;

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

// Activate reset button
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
      tipPercentage = Number(radioBtnTipInput) / 100;
    }
  });
});

// If custom tip exists, get tip % value
customTip.addEventListener('change', () => {
  const customTipInput = Number(customTip.value) / 100;
  tipPercentage = customTipInput;
});

// Watch for input and return totals; tip can be 0, not required to split bill
tipCalcForm.querySelectorAll('input').forEach(input => {
  input.addEventListener('change', () => {
    const billAmountInput = Number(billAmount.value);
    const numberOfPeopleInput = Number(numberOfPeople.value);
    const currentTipInput = tipPercentage; // Get radio btn % or custom %

    billTotal = billAmountInput;
    peopleTotal = numberOfPeopleInput;

    if ( billTotal >= 1 && peopleTotal >= 2 ) {
      calculateTotals(billTotal, currentTipInput, peopleTotal);
    }
  });
});

validateInputs();
