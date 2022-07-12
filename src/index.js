import './index.html';
import './cart.html';
import './card.html';
import './index.scss';

import 'swiper/css';

import { getGoodsHandler } from './modules/getGoodsHandler';
import { getGoods, getGoodsItem, getGoodsList } from './modules/goodsService';
import { preloader, preloaderRemove } from './modules/preloader';
import { renderItem } from './modules/renderItem';
import { renderRecommended } from './modules/renderRecommended';
import { filter } from './modules/filter';
import { categoryFooter } from './modules/categoryFooter';
import { cartControl, renderCartItem } from './modules/cartControl';
import { serviceCounter } from './modules/counterControl';
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
    preloader(card);

    serviceCounter({
      wrapper: '.card__count',
      number: '.card__number',
      selectorDec: '.card__btn_dec',
      selectorInc: '.card__btn_inc',
    });

    getGoodsItem(id)
      .then(item => {
        renderItem(item);
        cartControl({ classAdd: 'card__add-cart', classCount: 'card__number' });
        preloaderRemove();
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
  const cart = document.querySelector('.cart');
  if (cart) {
    const storage = localStorage.getItem('cart-ts');
    const cartGoods = storage ? JSON.parse(storage) : [null];
    const list = Object.keys(cartGoods);

    if (list.length) {
      preloader(cart);
      getGoodsList(list).then(goods => {
        renderCartItem(goods, cartGoods);
        cartControl();
        preloaderRemove();
      });
    }
  }
} catch (error) {
  console.warn(error);
}
