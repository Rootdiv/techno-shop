import { API_URI } from './var';

export const renderGoods = (wrapper, goods) => {
  wrapper.textContent = '';

  if (!goods.length) {
    wrapper.innerHTML = '<b>Нет товаров по вашему запросу</b>';
    wrapper.style = 'padding: 10px; display: flex; justify-content: center;';
  }

  const cards = goods.map(item => {
    const li = document.createElement('li');
    li.className = 'goods__item';
    li.insertAdjacentHTML(
      'afterbegin',
      `<article class="goods-item">
        <a href="./card.html?id=${item.id}" class="goods-item__link">
          <img width="340" height="340" src="${API_URI}/${item.images.present}" alt="${item.title}"
            class="goods-item__image" />
          <h3 class="goods-item__title">${item.title}</h3>
        </a>
        <div class="goods-item__buy">
          <p class="goods-item__price">${item.price} &#8381;</p>
          <button class="goods-item__to-card" data-id-goods="${item.id}">В корзину</button>
        </div>
      </article>`,
    );
    return li;
  });
  wrapper.append(...cards);
};
