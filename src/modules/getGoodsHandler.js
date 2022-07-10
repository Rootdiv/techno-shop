import { cartControl } from './cartControl';
import { getGoods } from './goodsService';
import { startPagination } from './pagination';
import { renderGoods } from './renderGoods';

export const getGoodsHandler = (goodsList, paginationWrapper, { classAdd, classDelete }) => {
  getGoods().then(({ goods, pages, page }) => {
    renderGoods(goodsList, goods);
    cartControl({ wrapper: goodsList, classAdd, classDelete });
    startPagination(paginationWrapper, pages, page);
  });
};
