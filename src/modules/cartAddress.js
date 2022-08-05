const cartAddressLoad = form => {
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
    form.save.checked = cartAddress.save;
  }
};

export const cartAddress = (form, btn) => {
  cartAddressLoad(form);
  const save = form.querySelector('.address__save');
  btn.addEventListener('click', event => {
    event.preventDefault();
    if (save.checked) {
      const formData = new FormData(form);
      const dataForm = {};
      formData.forEach((val, key) => {
        dataForm[key] = val;
      });
      localStorage.setItem('address-ts', JSON.stringify(dataForm));
    }
  });
};
