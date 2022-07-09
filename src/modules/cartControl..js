const addToCart = (id, count = 1) => {
  const store = localStorage.getItem('cart-ts');
  const cartGoods = store ? JSON.parse(store) : {};
  cartGoods[id] = count;
  localStorage.setItem('cart-ts', JSON.stringify(cartGoods));
};

const removeToCart = id => {
  const store = localStorage.getItem('cart-ts');
  const cartGoods = store ? JSON.parse(store) : {};
  delete cartGoods[id];
  localStorage.setItem('cart-ts', JSON.stringify(cartGoods));
};

const checkItems = ({ classAdd, classDelete, classCount } = {}) => {
  const store = localStorage.getItem('cart-ts');
  const cartGoods = store ? JSON.parse(store) : {};
  let count = 0;
  for (const cartGoodsKey in cartGoods) {
    count += cartGoods[cartGoodsKey];
  }
  const cartElem = document.querySelector('.header__cart');
  cartElem.dataset.count = count;
  if (classDelete) {
    const elements = document.querySelectorAll('[data-id-goods]');
    elements.forEach(elem => {
      if (cartGoods[elem.dataset.idGoods] && !elem.classList.contains('card__add-cart')) {
        elem.classList.add(classDelete);
        elem.textContent = 'В корзине';
      } else {
        elem.classList.remove(classDelete);
        elem.textContent = 'В корзину';
      }
    });
  }

  if (classAdd && classCount) {
    const countElem = document.querySelector(`.${classCount}`);
    const addElem = document.querySelector(`.${classAdd}`);
    countElem.value = cartGoods[addElem.dataset.idGoods] || 1;
  }
};

export const cartControl = ({ wrapper, classAdd, classDelete, classCount }) => {
  checkItems({ classAdd, classDelete, classCount });

  if (wrapper) {
    wrapper.addEventListener('click', event => {
      const target = event.target;
      const id = target.dataset.idGoods;
      if (!id) return;
      if (target.closest(`.${classDelete}`)) {
        removeToCart(id);
      } else if (target.closest(`.${classAdd}`)) {
        addToCart(id);
      }
      checkItems({ classDelete });
    });
  } else {
    const btn = document.querySelector(`.${classAdd}`);
    const id = btn.dataset.idGoods;
    const countElem = document.querySelector(`.${classCount}`);
    btn.addEventListener('click', () => {
      const count = +countElem.value;
      addToCart(id, count);
      checkItems();
    });
  }
};
