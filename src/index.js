import './index.html';
import './cart.html';
import './card.html';
import './index.scss';

import Swiper, { Thumbs, Scrollbar, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/pagination';

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
