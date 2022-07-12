import preloaderSvg from '../img/preloader.svg';

const div = document.createElement('div');
export const preloader = wrapper => {
  div.className = 'preloader';
  div.insertAdjacentHTML('afterbegin', `<img src="${preloaderSvg}" alt="Загрузка..." />`);
  wrapper.append(div);
};

export const preloaderRemove = () => {
  div.remove();
};
