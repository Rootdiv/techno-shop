import { getCategory, getGoods } from './goodsService';
import { showOverlay, hideOverlay } from './overlay';
import { startPagination } from './pagination';
import { preloader } from './preloader';
import { renderGoods } from './renderGoods';

const toggleFilter = (filter, catalogFilterBtn, filterTitle) => {
  catalogFilterBtn.addEventListener('click', () => {
    filter.classList.add('filter_show');
    showOverlay();
  });

  filterTitle.addEventListener('click', () => {
    filter.classList.remove('filter_show');
    hideOverlay();
  });
};

export const filter = (goodsList, paginationWrapper) => {
  const filter = document.querySelector('.filter');
  const catalogFilterBtn = document.querySelector('.catalog__filter-btn');
  const filterTitle = document.querySelector('.filter__title');
  const category = document.getElementById('category');

  toggleFilter(filter, catalogFilterBtn, filterTitle);

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
    url.search = '';
    if (search) {
      url.searchParams.set('search', search);
    }

    for (const key in data) {
      url.searchParams.set(key, data[key]);
    }

    history.pushState(null, null, url);

    getGoods().then(({ goods, pages, page }) => {
      filter.classList.remove('filter_show');
      hideOverlay();
      renderGoods(goodsList, goods);
      startPagination(paginationWrapper, pages, page);
    });
  });
};
