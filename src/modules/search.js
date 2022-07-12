import { getGoodsHandler } from './getGoodsHandler';
import { preloader } from './preloader';

export const searchWithoutReload = (goodsList, paginationWrapper) => {
  const searchForm = document.querySelector('.search');
  searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const searchValue = searchForm.search.value.trim();
    preloader(goodsList);
    const url = new URL(location);

    url.search = '';

    url.searchParams.set('search', searchValue);

    history.pushState(null, null, url);

    getGoodsHandler(goodsList, paginationWrapper, {
      classAdd: 'goods-item__to-card',
      classDelete: 'goods-item__to-card_remove',
    });
  });
};
