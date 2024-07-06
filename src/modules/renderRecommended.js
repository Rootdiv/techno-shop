import { API_URI } from './var';
import { cartControl } from './cartControl';

import Swiper, { Pagination } from 'swiper';
import 'swiper/css/pagination';

export const renderRecommended = (recommended, goods) => {
  recommended.textContent = '';
  if (goods?.length) {
    const container = document.createElement('div');
    container.className = 'container';
    recommended.append(container);

    const titleSection = document.createElement('h2');
    titleSection.className = 'recommended__title';
    titleSection.textContent = 'Возможно вам также понравится';

    const swiperBlock = document.createElement('div');
    swiperBlock.className = 'swiper recommended__carousel';

    container.append(titleSection, swiperBlock);

    const swiperWrapper = document.createElement('ul');
    swiperWrapper.className = 'swiper-wrapper';

    const swiperPagination = document.createElement('div');
    swiperPagination.className = 'swiper-pagination';

    swiperBlock.append(swiperWrapper, swiperPagination);

    const goodsCards = goods.map(item => {
      const swiperSlide = document.createElement('li');
      swiperSlide.className = 'swiper-slide';
      const price = new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0,
      }).format(item.price);
      swiperSlide.insertAdjacentHTML(
        'afterbegin',
        `<article class="goods-item">
          <a href="./card.html?id=${item.id}" class="goods-item__link">
            <img width="340" height="340" src="${API_URI}/${item.images.present}" alt="${item.title}"
              class="goods-item__image" />
            <h3 class="goods-item__title">${item.title}</h3>
          </a>
          <div class="goods-item__buy">
            <p class="goods-item__price">${price}</p>
            <button class="goods-item__to-card" data-id-goods="${item.id}">В корзину</button>
          </div>
        </article>`,
      );
      return swiperSlide;
    });

    swiperWrapper.append(...goodsCards);

    cartControl({
      wrapper: swiperBlock,
      classAdd: 'goods-item__to-cart',
      classDelete: 'goods-item__to-cart_remove',
    });

    new Swiper(swiperBlock, {
      modules: [Pagination],
      spaceBetween: 10,
      slidesPerView: 2,
      breakpoints: {
        520: {
          spaceBetween: 20,
          slidesPerView: 1,
        },
        620: {
          spaceBetween: 20,
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
        1600: {
          slidesPerView: 4,
          spaceBetween: 30,
        },
        1920: {
          slidesPerView: 5,
        },
      },
      pagination: {
        el: swiperPagination,
        clickable: true,
      },
    });
  } else {
    recommended.remove();
  }
};
