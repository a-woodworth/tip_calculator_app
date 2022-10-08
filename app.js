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

function formatInputTotal(number) {
  return Number(number.value);
}

function showBillInputErrorMessage() {
  const billErrorMessage = document.querySelector('.bill__total .form__error-message');
  const dollarAmount = billAmount.value;
  const resetAmount = billAmount.value = '';

  // Dollar value can't be 0 
  if ( dollarAmount <= 0 ) {
    billErrorMessage.classList.remove('not-visible');
    billAmount.classList.add('invalid');
    billAmount.setAttribute('aria-invalid', true);
    resetAmount;

    console.log('error!');
  // Dollar value can't be string  
  } else if ( dollarAmount === NaN ) {
    // resetAmountValue;
    console.log('error!');
  // Dollar value can't be empty string
  } else if ( dollarAmount === '' ) {
    console.log('error!');
  } else {
    console.log(formatInputTotal(bill));
  }
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
  // console.log(billAmount.checkValidity());
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
  // Start custom tip at 0 percent
  customTip.value = 0;

  if (radioBtnTips.value) {
    uncheckRadioBtn();
    tipPercentage = customTip.value;
  }
});

// Reset form
resetBtn.addEventListener('click', () => {
  tipCalcForm.reset();
  resetBtn.setAttribute('disabled', '');
});
