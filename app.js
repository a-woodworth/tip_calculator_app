const tipCalcForm = document.forms['calculator'];
const billAmount = tipCalcForm.elements.bill;
const radioBtnTips = tipCalcForm.elements.tip;
let tipPercentage = '';
const customTip = tipCalcForm.elements.customTip;
const numberOfPeople = tipCalcForm.elements.people;
const tipAmountText = tipCalcForm.elements.tipAmount.value;
const totalAmountText = tipCalcForm.elements.total.value;
const resetBtn = tipCalcForm.elements.reset;


// If custom tip selected, remove radio button selection
customTip.addEventListener('click', () => {
  if (radioBtnTips.value) {
    uncheckRadioBtn();
  }
});

function uncheckRadioBtn() {
  const activeRadioBtn = document.querySelector('input[type="radio"]:checked');
  activeRadioBtn.checked = false;
}
