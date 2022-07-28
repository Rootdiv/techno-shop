import svg from '../img/sprite.svg';

export const sendModal = statusSend => {
  const overlay = document.querySelector('.overlay');
  const modal = document.querySelector('.modal');

  overlay.style.transitionDuration = '0.36s';
  modal.style.transitionDuration = '0.36s';

  overlay.classList.add('overlay_open');
  modal.classList.add('modal_open');

  overlay.addEventListener('click', () => {
    overlay.classList.remove('overlay_open');
    modal.classList.remove('modal_open');
  });

  modal.textContent = '';
  if (statusSend === 'confirm') {
    modal.insertAdjacentHTML(
      'afterbegin',
      `<div class="confirm">
        <div class="confirm__title">Ваша заявка успешно отправлена</div>
        <div class="confirm__message">
          <b>Наши менеджеры свяжутся с вами в течении 3-х рабочих дней</b>
        </div>
        <div class="confirm__icon">
          <svg width="100" height="100">
            <use href="${svg}#confirm" />
          </svg>
        </div>
      </div>`,
    );
  } else {
    modal.insertAdjacentHTML(
      'afterbegin',
      `<div class="error">
        <div class="error__title">Упс... Что-то пошло не так</div>
        <div class="error__message">
          <b>Не удалось отправить заказ. Пожалуйста, повторите отправку еще раз</b>
        </div>
        <div class="error__icon">
          <svg width="100" height="100">
            <use href="${svg}#error" />
          </svg>
        </div>
      </div>`,
    );
  }
};
