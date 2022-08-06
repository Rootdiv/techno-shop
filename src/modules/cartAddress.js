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
    form.full_name.value = cartAddress.full_name;
    form.postcode.value = cartAddress.postcode;
    form.save.checked = true;
  }
};

export const cartAddress = form => {
  cartAddressLoad(form);
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (
      form.city.value !== '' &&
      form.street.value.trim() !== '' &&
      form.flat.value.trim() !== '' &&
      form.full_name.value.trim() !== '' &&
      form.postcode.value.trim() !== '' &&
      form.save.checked
    ) {
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
