const hide = elem => {
  if (!elem.classList.contains('footer__list_show') || elem.collapsing) return;
  elem.style.height = `${elem.offsetHeight}px`;
  elem.offsetHeight;
  elem.style.display = 'block';
  elem.style.height = 0;
  elem.style.overflow = 'hidden';
  elem.style.transition = 'height 360ms ease-in-out';
  elem.classList.remove('footer__list_show');
  elem.collapsing = true;
  setTimeout(() => {
    elem.removeAttribute('style');
    elem.collapsing = false;
  }, 370);
};

const show = elem => {
  if (elem.classList.contains('footer__list_show') || elem.collapsing) return;
  elem.style.display = 'block';
  const height = elem.offsetHeight;
  elem.style.height = 0;
  elem.style.overflow = 'hidden';
  elem.style.transition = 'height 360ms ease-in-out';
  elem.offsetHeight;
  elem.style.height = `${height}px`;
  elem.collapsing = true;
  setTimeout(() => {
    elem.classList.add('footer__list_show');
    elem.removeAttribute('style');
    elem.collapsing = false;
  }, 370);
};

export const footerMenuToggle = wrapper => {
  wrapper.addEventListener('click', event => {
    if (window.innerWidth <= 560) {
      const target = event.target;
      if (target.closest('.footer__catalog')) {
        target.classList.toggle('footer__column-title_open');
        const openCatalog = target.closest('.footer__catalog');
        const listCatalog = openCatalog.querySelector('.footer__list');
        listCatalog.classList.contains('footer__list_show') ? hide(listCatalog) : show(listCatalog);
      } else if (target.closest('.footer__customer')) {
        target.classList.toggle('footer__column-title_open');
        const openCustomer = target.closest('.footer__customer');
        const listCustomer = openCustomer.querySelector('.footer__list');
        listCustomer.classList.contains('footer__list_show') ? hide(listCustomer) : show(listCustomer);
      }
    }
  });
};
