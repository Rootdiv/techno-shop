import { getCategory } from './goodsService';

export const categoryFooter = categoryFooter => {
  getCategory().then(categoryList => {
    for (const categoryListKey in categoryList) {
      const li = document.createElement('li');
      li.className = 'footer__item';
      const a = document.createElement('a');
      a.className = 'footer__link';
      a.href = `./index.html?category=${categoryListKey}`;
      a.textContent = categoryList[categoryListKey];
      li.append(a);
      categoryFooter.append(li);
    }
  });
};
