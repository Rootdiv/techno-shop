import { cartAddress } from './cartAddress';
import { serviceCounter } from './counterControl';
import { getGoodsList } from './goodsService';
import { sendModal } from './sendModal';
import { API_URI } from './var';

const addToCart = (id, count = 1) => {
  const storage = localStorage.getItem('cart-ts');
  const cartGoods = storage ? JSON.parse(storage) : {};
  cartGoods[id] = count;
  localStorage.setItem('cart-ts', JSON.stringify(cartGoods));
};

const removeToCart = id => {
  const storage = localStorage.getItem('cart-ts');
  const cartGoods = storage ? JSON.parse(storage) : {};
  delete cartGoods[id];
  //Если cartGoods содержит ключи, то сохраняем данные иначе удаляем.
  if (Object.keys(cartGoods).length) {
    localStorage.setItem('cart-ts', JSON.stringify(cartGoods));
  } else {
    localStorage.removeItem('cart-ts');
  }
};

const checkItems = ({ classAdd, classDelete, classCount } = {}) => {
  const storage = localStorage.getItem('cart-ts');
  const cartGoods = storage ? JSON.parse(storage) : {};
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

export const cartControl = ({ wrapper, classAdd, classDelete, classCount } = {}) => {
  checkItems({ classAdd, classDelete, classCount });

  if (wrapper && classAdd && classDelete) {
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
  } else if (classAdd && classCount) {
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

const sendGoods = {};

const renderTotalCart = (goods, city = '') => {
  const storage = localStorage.getItem('cart-ts');
  const cartGoods = storage ? JSON.parse(storage) : [];

  const totalTable = document.querySelector('.total__table');
  totalTable.textContent = '';

  const totalCart = goods.reduce((sum, product) => product.price * cartGoods[product.id] + sum, 0);
  const totalItemCart = goods.reduce((sum, product) => cartGoods[product.id] + sum, 0);
  let delivery = 0;
  let percent = 0;
  let discount = 0;

  if (totalCart) {
    delivery = 500;
  }

  if (totalItemCart >= 10) {
    percent = 5;
    discount = Math.floor((totalCart / 100) * percent);
  } else if (totalItemCart >= 20) {
    percent = 10;
    discount = Math.floor((totalCart / 100) * percent);
  }

  let deliveryDay = 3;
  switch (true) {
    case city === 'Kazan':
      deliveryDay = 4;
      break;
    case city === 'Yekaterinburg':
      deliveryDay = 6;
      break;
    case city === 'Chelyabinsk':
      deliveryDay = 7;
      break;
    case city === 'Kaliningrad':
      deliveryDay = 10;
      break;
    case city === 'Novosibirsk':
      deliveryDay = 12;
      break;
    case city === 'Volgograd':
      deliveryDay = 8;
      break;
  }
  const date = new Date();
  const dateStart = new Intl.DateTimeFormat('ru', { day: '2-digit', month: 'long' }).format(date);
  const periodDay = date.setDate(date.getDate() + deliveryDay);
  const dateEnd = new Intl.DateTimeFormat('ru', { day: '2-digit', month: 'long' }).format(periodDay);

  totalTable.insertAdjacentHTML(
    'afterbegin',
    `<li class="total__row total__row_header">
      <span>Итого</span>
      <span>${totalCart - discount + delivery} &#8381;</span>
    </li>
    <li class="total__row total__row_gray">
      <span>Товары, ${totalItemCart} шт.</span>
      <span>${totalCart} &#8381;</span>
    </li>
    <li class="total__row total__row_gray">
      <span>Скидка</span>
      <span>${discount} &#8381;</span>
    </li>
    <li class="total__row total__row_gray total__row_gap">
      <span>Доставка</span>
      <span>${delivery} &#8381;</span>
    </li>
    <li class="total__row">
      <span>Дата</span>
      <span>${dateStart} - ${dateEnd}</span>
    </li>
    <li class="total__row">
      <span>Оплата</span>
      <span>Картой</span>
    </li>`,
  );

  sendGoods['orderGoods'] = goods.map(item => ({
    goods: item,
    count: cartGoods[item.id],
  }));
  sendGoods['delivery'] = delivery;
  sendGoods['discount'] = discount;
  sendGoods['totalPrice'] = totalCart;
};

export const cityChange = () => {
  const storage = localStorage.getItem('cart-ts');
  const cartGoods = storage ? JSON.parse(storage) : [];
  const list = Object.keys(cartGoods);
  const citySelect = document.querySelector('.address__item_select');
  citySelect.addEventListener('change', () => {
    getGoodsList(list).then(goods => {
      renderTotalCart(goods, citySelect.value);
    });
  });
};

const sendCart = cart =>
  fetch(`${API_URI}/api/order`, {
    method: 'POST',
    body: JSON.stringify(cart),
  });

export const totalSend = (totalSubmit, addressForm) => {
  const cartWrapper = document.querySelector('.cart-goods__list');
  const totalAgreeCheckbox = document.querySelector('.total__agree-checkbox');
  totalSubmit.addEventListener('click', () => {
    sendGoods['address'] = cartAddress(addressForm);
    if (totalAgreeCheckbox.checked && sendGoods.address) {
      sendCart(sendGoods)
        .then(response => {
          if (response.ok) {
            localStorage.removeItem('cart-ts');
            sendModal('confirm');
            checkItems();
            renderTotalCart([]);
            cartWrapper.textContent = '';
            cartWrapper.insertAdjacentHTML('afterbegin', '<li class="cart-goods__null">В корзине нет товаров</li>');
            totalAgreeCheckbox.checked = false;
          }
        })
        .catch(error => {
          sendModal('error');
          console.error(error);
        });
    }
  });
};

export const renderCartItem = (goods, cartGoods) => {
  const storage = localStorage.getItem('address-ts');
  const city = storage ? JSON.parse(storage).city : '';
  renderTotalCart(goods, city);

  const cartWrapper = document.querySelector('.cart-goods__list');
  cartWrapper.textContent = '';

  goods.forEach(item => {
    const li = document.createElement('li');
    li.className = 'cart-goods__item item';

    const img = new Image();
    img.className = 'item__img';
    img.src = `${API_URI}/${item.images.present}`;
    img.alt = item.title;

    const detail = document.createElement('div');
    detail.className = 'item__detail';

    const title = document.createElement('h4');
    title.className = 'item__title';
    title.textContent = item.title;

    const vendor = document.createElement('p');
    vendor.className = 'item__vendor-code';
    vendor.textContent = `Артикул: ${item.id}`;

    const control = document.createElement('div');
    control.className = 'item__control';

    const count = document.createElement('div');
    count.className = 'item__count';
    count.dataset.idGoods = item.id;

    const dec = document.createElement('button');
    dec.className = 'item__btn item__btn_dec';
    dec.ariaLabel = 'Уменьшить количество товара';
    dec.textContent = '–';

    const number = document.createElement('output');
    number.className = 'item__number';
    number.value = cartGoods[item.id];

    const inc = document.createElement('button');
    inc.className = 'item__btn item__btn_inc';
    inc.ariaLabel = 'Увеличить количество товара';
    inc.textContent = '+';

    count.append(dec, number, inc);

    const price = document.createElement('p');
    price.className = 'item__price';
    price.textContent = new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0,
    }).format(item.price);

    const remove = document.createElement('button');
    remove.className = 'item__remove-cart';
    remove.ariaLabel = 'Удалить товар из корзины';
    remove.insertAdjacentHTML(
      'afterbegin',
      `<svg width="32" height="32">
        <use href="#remove" />
      </svg>`,
    );

    detail.append(title, vendor);
    control.append(count, price, remove);
    li.append(img, detail, control);
    cartWrapper.append(li);

    serviceCounter({ wrapper: count, number, selectorDec: '.item__btn_dec', selectorInc: '.item__btn_inc' });

    count.addEventListener('click', event => {
      const target = event.target;
      if (target.closest('.item__btn_dec, .item__btn_inc')) {
        addToCart(item.id, +number.value);
        renderTotalCart(goods);
        checkItems();
      }
    });

    remove.addEventListener('click', () => {
      removeToCart(item.id);
      li.remove();
      checkItems();
      const storage = localStorage.getItem('cart-ts');
      const cartGoods = storage ? JSON.parse(storage) : [];
      const list = Object.keys(cartGoods);
      if (list.length === 0) {
        renderTotalCart([]);
        cartWrapper.insertAdjacentHTML('afterbegin', '<li class="cart-goods__null">В корзине нет товаров</li>');
      } else {
        getGoodsList(list).then(goods => {
          renderCartItem(goods, cartGoods);
          renderTotalCart(goods);
        });
      }
    });
  });
};
