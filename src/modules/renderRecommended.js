import { API_URI } from './var';
import Swiper, { Pagination } from 'swiper';
import 'swiper/css/pagination';

export const renderRecommended = (wrapper, goods) => {
  wrapper.textContent = '';
  const ul = document.createElement('ul');
  ul.className = 'swiper-wrapper';
  const swiperPagination = document.createElement('div');
  swiperPagination.className = 'swiper-pagination';
  const cards = goods.map(item => {
    const li = document.createElement('li');
    li.className = 'swiper-slide';
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
  ul.append(...cards);
  wrapper.append(ul, swiperPagination);

  new Swiper('.recommended__carousel', {
    modules: [Pagination],
    slidesPerView: 5,
    spaceBetween: 30,
    pagination: {
      el: swiperPagination,
      clickable: true,
    },
  });
};
