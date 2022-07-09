import { getCategory, getGoods } from './goodsService';
import { startPagination } from './pagination';
import { preloader } from './preloader';
import { renderGoods } from './renderGoods';

export const filter = (goodsList, paginationWrapper) => {
  const category = document.getElementById('category');
  getCategory().then(categoryList => {
    for (const categoryListKey in categoryList) {
      const option = document.createElement('option');
      option.value = categoryListKey;
      option.textContent = categoryList[categoryListKey];
      category.append(option);
    }
  });

  const filterForm = document.querySelector('.filter__form');
  filterForm.addEventListener('submit', event => {
    event.preventDefault();

    const checkboxes = new Set();
    [...filterForm.elements].forEach(elem => {
      if (elem.type === 'checkbox') {
        checkboxes.add(elem.name);
      }
    });
    const data = {};

    const formData = new FormData(filterForm);

    for (const [name, value] of formData) {
      if (!value) continue;
      if (checkboxes.has(name)) {
        if (Array.isArray(data[name])) {
          data[name].push(value);
        } else {
          data[name] = [value];
        }
      } else {
        data[name] = value;
      }
    }

    preloader(goodsList);
    const url = new URL(location);
    const search = url.searchParams.get('search');
    console.log('search: ', search);
    url.search = '';

    for (const key in data) {
      url.searchParams.set(key, data[key]);
    }

    history.pushState(null, null, url);

    getGoods().then(({ goods, pages, page }) => {
      renderGoods(goodsList, goods);
      startPagination(paginationWrapper, pages, page);
    });
  });
};
