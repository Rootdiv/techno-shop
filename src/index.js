import './index.html';
import './cart.html';
import './card.html';
import './index.scss';

import 'swiper/css';

import { getGoodsHandler } from './modules/getGoodsHandler';
import { getGoodsCategoryItem, getGoodsItem, getGoodsList } from './modules/goodsService';
import { preloader, preloaderRemove } from './modules/preloader';
import { renderItem } from './modules/renderItem';
import { renderRecommended } from './modules/renderRecommended';
import { filter } from './modules/filter';
import { categoryFooter } from './modules/categoryFooter';
import { cartControl, cityChange, renderCartItem, totalSend } from './modules/cartControl';
import { serviceCounter } from './modules/counterControl';
import { searchWithoutReload } from './modules/search';
import { footerMenuToggle } from './modules/footerMenuToggle';
import { cartAddressLoad, cartAddressSave } from './modules/cartAddress';

const footerListCatalog = document.querySelector('.footer__list_double');
categoryFooter(footerListCatalog);

const footerContainer = document.querySelector('.footer__container');
footerMenuToggle(footerContainer);

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
  const recommended = document.querySelector('.recommended');

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
        if (item.message) {
          card.classList.add('card_empty');
          card.textContent = '';
          const p = document.createElement('p');
          p.className = 'card__empty';
          p.textContent = item.message;
          card.append(p);
          return;
        }
        renderItem(item);
        cartControl({ classAdd: 'card__add-cart', classCount: 'card__number' });
        preloaderRemove();
        return item.category;
      })
      .then(category => category && getGoodsCategoryItem(category))
      .then(data => {
        const goods = data?.goods.filter(item => item.id !== id);
        renderRecommended(recommended, goods);
      });
  }
} catch (error) {
  console.warn(error);
}

try {
  const cart = document.querySelector('.cart');
  if (cart) {
    const totalSubmit = cart.querySelector('.total__submit');
    const addressForm = document.querySelector('.address__form');
    const addressBtn = addressForm.querySelector('.address__item_btn');
    const storage = localStorage.getItem('cart-ts');
    const cartGoods = storage ? JSON.parse(storage) : [];
    const list = Object.keys(cartGoods);
    addressForm.reset();

    if (list.length) {
      preloader(cart);
      getGoodsList(list).then(goods => {
        renderCartItem(goods, cartGoods);
        cartControl();
        cityChange();
        preloaderRemove();
        cartAddressLoad(addressForm);
        cartAddressSave(addressForm);
        totalSend(totalSubmit, addressForm);
      });
      totalSubmit.removeAttribute('disabled');
      addressBtn.removeAttribute('disabled');
    }
  }
} catch (error) {
  console.warn(error);
}
