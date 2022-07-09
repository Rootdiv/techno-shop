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
import { cartControl } from './modules/cartControl.';
import { serviceCounter } from './modules/counterControl';

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
      cartControl({
        wrapper: goodsList,
        classAdd: 'goods-item__to-card',
        classDelete: 'goods-item__to-card_remove',
      });
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

    serviceCounter({
      selectorWrapper: '.card__count',
      selectorNumber: '.card__number',
      selectorDec: '.card__btn_dec',
      selectorInc: '.card__btn_inc',
    });

    getGoodsItem(id)
      .then(item => {
        renderItem(item);
        cartControl({ classAdd: 'card__add-cart', classCount: 'card__number' });
        preloadWrapper.remove();
        return item.category;
      })
      .then(category => getGoods({ category }))
      .then(data => {
        const goods = data.goods.filter(item => item.id !== id);
        renderRecommended(recommendedCarousel, goods);
        cartControl({
          wrapper: recommendedCarousel,
          classAdd: 'goods-item__to-card',
          classDelete: 'goods-item__to-card_remove',
        });
      });
  }
} catch (error) {
  console.warn(error);
}
