import './index.html';
import './cart.html';
import './card.html';
import './index.scss';

import Swiper, { Thumbs, Scrollbar, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/pagination';
import { startPagination } from './modules/pagination';
import { getGoods } from './modules/goodsService';
import { renderGoods } from './modules/renderGoods';
import preloader from './img/preloader.svg';

try {
  const paginationWrapper = document.querySelector('.pagination');
  const goodsList = document.querySelector('.goods__list');
  const pageURL = new URL(location);
  const page = +pageURL.searchParams.get('page') || 1;

  goodsList.insertAdjacentHTML(
    'afterbegin',
    `<div class="goods__preloader">
      <img src="${preloader}" alt="Загрузка..." />
    </div>`,
  );

  getGoods({ page }).then(({ goods, pages, page }) => {
    renderGoods(goodsList, goods);
    startPagination(paginationWrapper, pages, page);
  });
} catch (error) {
  console.warn(error);
  console.warn('Это не главная страница');
}

const thumbSwiper = new Swiper('.card__slide-thumb', {
  spaceBetween: 44,
  slidesPerView: 3,
  modules: [Scrollbar],
  scrollbar: {
    el: '.swiper-scrollbar',
    draggable: true,
  },
});

new Swiper('.card__image', {
  spaceBetween: 10,
  slidesPerView: 1,
  modules: [Thumbs],
  thumbs: {
    swiper: thumbSwiper,
    slideThumbActiveClass: 'card__thumb-btn_active',
  },
});

new Swiper('.recommended__carousel', {
  modules: [Pagination],
  slidesPerView: 5,
  spaceBetween: 30,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
});
