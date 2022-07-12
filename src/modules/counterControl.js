export const serviceCounter = ({ wrapper, number, selectorDec, selectorInc }) => {
  let wrapCounter = null;
  let numberElem = null;
  if (typeof wrapper === 'string') {
    wrapCounter = document.querySelector(wrapper);
    numberElem = wrapCounter.querySelector(number);
  } else {
    wrapCounter = wrapper;
    numberElem = number;
  }

  wrapCounter.addEventListener('click', event => {
    const target = event.target;
    if (target.closest(selectorDec)) {
      numberElem.value = +numberElem.value === 1 ? 1 : +numberElem.value - 1;
    }
    if (target.closest(selectorInc)) {
      numberElem.value = +numberElem.value + 1;
    }
  });
};
