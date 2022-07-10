import './index.html';
import './cart.html';
import './card.html';
import './index.scss';

import 'swiper/css';

import { getGoodsHandler } from './modules/getGoodsHandler';
import { getCartItem, getGoods, getGoodsItem } from './modules/goodsService';
import { preloader } from './modules/preloader';
import { renderItem } from './modules/renderItem';
import { renderRecommended } from './modules/renderRecommended';
import { filter } from './modules/filter';
import { categoryFooter } from './modules/categoryFooter';
import { cartControl } from './modules/cartControl';
import { serviceCounter } from './modules/counterControl';
import { renderCartItem } from './modules/renderCartItem';
import { searchWithoutReload } from './modules/search';

const footerListCatalog = document.querySelector('.footer__list_double');
categoryFooter(footerListCatalog);

try {
  const goodsList = document.querySelector('.goods__list');
  if (goodsList) {
    const paginationWrapper = document.querySelector('.pagination');

    searchWithoutReload(goodsList, paginationWrapper);

    filter(goodsList, paginationWrapper);

    preloader(goodsList);

    getGoodsHandler(goodsList, paginationWrapper, {
      classAdd: 'goods-item__to-card',
      classDelete: 'goods-item__to-card_remove',
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

try {
  const cartWrapper = document.querySelector('.cart-goods__list');
  if (cartWrapper) {
    const storage = localStorage.getItem('cart-ts');
    const cartGoods = storage ? JSON.parse(storage) : [null];
    const id = [];

    for (const cartGoodsKey in cartGoods) {
      id.push(cartGoodsKey);
    }

    getCartItem(id).then(goods => {
      renderCartItem(cartWrapper, goods, cartGoods);
      if (!cartGoods.length) {
        serviceCounter({
          selectorWrapper: '.item__count',
          selectorNumber: '.item__number',
          selectorDec: '.item__btn_dec',
          selectorInc: '.item__btn_inc',
        });
      }
    });
  }
} catch (error) {
  console.warn(error);
}
