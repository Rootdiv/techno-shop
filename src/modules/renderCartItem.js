import { API_URI } from './var';

export const renderCartItem = (wrapper, goods, cartGoods) => {
  wrapper.textContent = '';

  if (!goods.length) {
    wrapper.innerHTML = '<b>В корзине нет товаров</b>';
    wrapper.style = 'padding: 10px; display: flex; justify-content: center;';
  }

  const cards = goods.map(item => {
    const li = document.createElement('li');
    li.className = 'cart-goods__item item';
    li.insertAdjacentHTML(
      'afterbegin',
      `<img src="${API_URI}/${item.images.present}" alt="${item.title}" class="item__img" />
        <div class="item__detail">
          <h4 class="item__title">${item.title}</h4>
          <p class="item__vendor-code">Артикул: ${item.id}</p>
        </div>
        <div class="item__control">
          <div class="item__count">
            <button class="item__btn item__btn_dec" aria-label="Уменьшить количество товара">–</button>
            <output class="item__number">${cartGoods[item.id]}</output>
            <button class="item__btn item__btn_inc" aria-label="Увеличить количество товара">+</button>
          </div>
          <p class="item__price">${item.price} &#8381;</p>
          <button class="item__remove-cart" aria-label="Удалить товар из корзины">
            <svg width="32" height="32">
              <use href="#remove" />
            </svg>
          </button>
        </div>`,
    );
    return li;
  });
  wrapper.append(...cards);
};
