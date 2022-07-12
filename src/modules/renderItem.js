import { API_URI } from './var';
import Swiper, { Thumbs, Scrollbar } from 'swiper';
import 'swiper/css/scrollbar';

const createCardImageSlider = largeImages => {
  const ul = document.createElement('ul');
  ul.className = 'swiper-wrapper';
  const cardImageSlides = largeImages.map(url => {
    const li = document.createElement('li');
    li.className = 'swiper-slide';
    const img = new Image();
    img.src = `${API_URI}/${url}`;
    li.append(img);
    return li;
  });

  ul.append(...cardImageSlides);
  return ul;
};

const createCardImageThumbSlider = smallImages => {
  const ul = document.createElement('ul');
  ul.className = 'swiper-wrapper';
  const cardImageThumbSlides = smallImages.map(url => {
    const li = document.createElement('li');
    li.className = 'swiper-slide';
    const button = document.createElement('button');
    button.className = 'card__thumb-btn';
    const img = new Image();
    img.src = `${API_URI}/${url}`;
    button.append(img);
    li.append(button);
    return li;
  });

  if (cardImageThumbSlides.length !== 1) {
    ul.append(...cardImageThumbSlides);
  }

  return ul;
};

const createParams = params => {
  const list = [];
  for (const key in params) {
    const li = document.createElement('li');
    li.className = 'card__params-item';
    li.insertAdjacentHTML('afterbegin', `<span>${key}:</span><span>${params[key]}</span>`);
    list.push(li);
  }
  return list;
};

const createDescription = descriptions => {
  const list = [];
  for (const description of descriptions) {
    const p = document.createElement('p');
    p.textContent = description;

    list.push(p);
  }
  return list;
};

export const renderItem = item => {
  const cardImage = document.querySelector('.card__image');
  cardImage.append(createCardImageSlider(item.images.large));

  const cardSliderThumb = document.querySelector('.card__slider-thumb');
  const swiperScrollbar = document.createElement('div');
  swiperScrollbar.className = 'swiper-scrollbar';
  cardSliderThumb.append(createCardImageThumbSlider(item.images.small), swiperScrollbar);

  const cardTitle = document.querySelector('.card__title');
  cardTitle.textContent = item.title;
  const cardVendorCode = document.querySelector('.card__vendor-code');
  cardVendorCode.textContent = `Артикул: ${item.id}`;
  const cardPrice = document.querySelector('.card__price');
  cardPrice.textContent = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(item.price);
  const cardAddCart = document.querySelector('.card__add-cart');
  cardAddCart.dataset.idGoods = item.id;

  const cardParamsList = document.querySelector('.card__params-list');
  cardParamsList.append(...createParams(item.characteristic));

  const cardDescriptionText = document.querySelector('.card__description-text');
  cardDescriptionText.append(...createDescription(item.description));

  const thumbSwiper = new Swiper(cardSliderThumb, {
    spaceBetween: 15,
    slidesPerView: 3,
    breakpoints: {
      768: {
        spaceBetween: 20,
      },
      1024: {
        spaceBetween: 27,
      },
      1600: {
        spaceBetween: 44,
      },
    },
    modules: [Scrollbar],
    scrollbar: {
      el: swiperScrollbar,
      draggable: true,
    },
  });

  new Swiper(cardImage, {
    spaceBetween: 10,
    slidesPerView: 1,
    modules: [Thumbs],
    thumbs: {
      swiper: thumbSwiper,
      slideThumbActiveClass: 'card__thumb-btn_active',
    },
  });
};
