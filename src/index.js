import './index.html';
import './cart.html';
import './card.html';
import './index.scss';

import 'swiper/css';

import { startPagination } from './modules/pagination';
import { getGoods, getGoodsItem } from './modules/goodsService';
import { renderGoods } from './modules/renderGoods';
import { preloader } from './modules/preloader';
import { renderItem } from './modules/renderItem';
import { renderRecommended } from './modules/renderRecommended';
import { filter } from './modules/filter';
import { categoryFooter } from './modules/categoryFooter';

const footerListCatalog = document.querySelector('.footer__list_double');
categoryFooter(footerListCatalog);

try {
  const goodsList = document.querySelector('.goods__list');
  if (goodsList) {
    const paginationWrapper = document.querySelector('.pagination');

    filter(goodsList, paginationWrapper);

    preloader(goodsList);

    getGoods().then(({ goods, pages, page }) => {
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
    const preloadWrapper = document.createElement('div');
    preloadWrapper.className = 'card__preloader';
    preloader(preloadWrapper);
    card.append(preloadWrapper);

    getGoodsItem(id)
      .then(item => {
        renderItem(item);
        preloadWrapper.remove();
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
