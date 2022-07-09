import preloaderSvg from '../img/preloader.svg';

export const preloader = wrapper => {
  wrapper.insertAdjacentHTML(
    'afterbegin',
    `<div class="goods__preloader">
      <img src="${preloaderSvg}" alt="Загрузка..." />
    </div>`,
  );
};
