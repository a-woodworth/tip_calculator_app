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


function activateResetBtn() {
  resetBtn.removeAttribute('disabled');
}

function uncheckRadioBtn() {
  const activeRadioBtn = document.querySelector('input[type="radio"]:checked');
  activeRadioBtn.checked = false;
}

function numberToCurrency(amount) {
  const valueAsDollars = {style: 'currency', currency: 'USD', maximumFractionDigits: 2}
  const numberFormat = new Intl.NumberFormat('en-US', valueAsDollars);
  return numberFormat.format(amount);
}

function displayInputError(message, input) {
  message.classList.remove('not-visible');
  input.classList.add('invalid');
  input.setAttribute('aria-invalid', true);
  input.setAttribute('aria-live', 'polite');
}

function removeInputError(message, input) {
  message.classList.add('visible');
  input.classList.remove('invalid');
  input.setAttribute('aria-invalid', false);
  input.removeAttribute('aria-live', 'polite');
}

function showBillInputErrorMessage() {
  const billErrorMessage = document.querySelector('.bill__total .form__error-message');
  const dollarAmount = billAmount.value;

  // Bill can't be less than 0 
  if ( dollarAmount < 0 ) {
    billErrorMessage.innerText = `Can't be negative`;
  }
  // Bill can't be letters or blank   
  if ( dollarAmount === NaN || dollarAmount === '' ) {
    billErrorMessage.innerText = `Enter a number`;
  }
  // Bill can't be zero
  if ( dollarAmount === '0.00' ) {
    billErrorMessage.innerText = `Can't be zero`;
  } 
  // Bill can't exceed max value 
  if ( dollarAmount >= '100000.00' ) {
    billErrorMessage.innerText = `Error: value too large`;
  }

  displayInputError(billErrorMessage, billAmount); 
}

// Enable button so form can be reset form
[billAmount, numberOfPeople].forEach(inputField => {
  inputField.addEventListener('click', () => {
    activateResetBtn();
  });
});

// Format billAmount so only 2 decimal places displayed after input entered
billAmount.addEventListener('change', e => {
  e.currentTarget.value = parseFloat(e.currentTarget.value).toFixed(2);
});

// Get tip % from radio button
radioBtnTips.forEach(radioBtn => {
  radioBtn.addEventListener('change', () => {
    activateResetBtn();
    tipPercentage = radioBtn.value;
  });
});

customTip.addEventListener('click', () => {
  activateResetBtn();

  // Remove radio button value
  if (radioBtnTips.value) {
    uncheckRadioBtn();
  }

  tipPercentage = customTip.value;
});

// Reset form
resetBtn.addEventListener('click', () => {
  tipCalcForm.reset();
  resetBtn.setAttribute('disabled', '');
});
