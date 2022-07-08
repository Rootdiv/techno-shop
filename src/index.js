import './index.html';
import './cart.html';
import './card.html';
import './index.scss';

import 'swiper/css';

import { startPagination } from './modules/pagination';
import { getGoods, getGoodsItem } from './modules/goodsService';
import { renderGoods } from './modules/renderGoods';
import preloader from './img/preloader.svg';
import { renderItem } from './modules/renderItem';
import { renderRecommended } from './modules/renderRecommended';

try {
  const goodsList = document.querySelector('.goods__list');
  if (goodsList) {
    const paginationWrapper = document.querySelector('.pagination');
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
  }
} catch (error) {
  console.warn(error);
}

try {
  const card = document.querySelector('.card');
  const recommendedCarousel = document.querySelector('.recommended__carousel');
  if (card) {
    const pageURL = new URL(location);
    const id = pageURL.searchParams.get('id');

    const preload = document.createElement('div');
    preload.className = 'card__preloader';
    preload.insertAdjacentHTML(
      'afterbegin',
      `<div class="goods__preloader">
        <img src="${preloader}" alt="Загрузка..." />
      </div>`,
    );
    card.append(preload);

    getGoodsItem(id)
      .then(item => {
        renderItem(item);
        preload.remove();
        return item.category;
      })
      .then(category => getGoods({ category }))
      .then(data => {
        const goods = data.goods.filter(item => item.id !== id);
        renderRecommended(recommendedCarousel, goods);
      });
  }
} catch (error) {
  console.warn(error);
}
