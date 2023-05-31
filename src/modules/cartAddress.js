export const cartAddressLoad = form => {
  const storage = localStorage.getItem('address-ts');
  const cartAddress = storage ? JSON.parse(storage) : null;
  if (cartAddress) {
    const cities = form.city.options;
    for (let i = 0; i < cities.length; i++) {
      if (cartAddress.city === form.city.options[i].value) {
        form.city.options[i].selected = true;
      }
    }
    form.street.value = cartAddress.street;
    form.flat.value = cartAddress.flat;
    form.fullName.value = cartAddress.fullName;
    form.postcode.value = cartAddress.postcode;
    form.save.checked = true;
  }
};

const validForm = form => {
  if (
    form.city.value !== '' &&
    form.street.value.trim() !== '' &&
    form.flat.value.trim() !== '' &&
    form.fullName.value.trim() !== '' &&
    form.postcode.value.trim() !== ''
  ) {
    return true;
  } else {
    return false;
  }
};

export const cartAddress = form => {
  const storage = localStorage.getItem('address-ts');
  if (storage) {
    return JSON.parse(storage);
  } else if (validForm(form)) {
    return {
      city: form.city.value,
      street: form.street.value,
      flat: form.flat.value,
      fullName: form.fullName.value,
      postcode: form.postcode.value,
    };
  }
  return null;
};

export const cartAddressSave = form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (validForm(form) && form.save.checked) {
      const formData = new FormData(form);
      const dataForm = {};
      formData.forEach((val, key) => {
        if (key !== 'save') {
          dataForm[key] = val;
        }
      });
      localStorage.setItem('address-ts', JSON.stringify(dataForm));
    } else {
      localStorage.removeItem('address-ts');
    }
  });
};
