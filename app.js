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
  // Start custom tip at 0 percent
  customTip.value = 0;

  // if (radioBtnTips.value) {
  //   uncheckRadioBtn();
  //   tipPercentage = customTip.value;
  // }
});

// Reset form
resetBtn.addEventListener('click', () => {
  tipCalcForm.reset();
  resetBtn.setAttribute('disabled', '');
});
