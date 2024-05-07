import AbstractView from '../framework/view/abstract-view';
import { humanizeDateFormat, humanizeDuration } from '../utils/utils';
import { iconsCollection } from '../constants/constants';

export default class PointsView extends AbstractView {
  #point = {};
  #price = 0;
  #handleEditClick = null;

  constructor(point, onEditClick) {
    super();
    this.#point = point;
    this.#handleEditClick = onEditClick;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  }

  calculatePrice() {
    this.#point.offers?.forEach((offer) => {
      this.#price += offer.price;
    });
  }

  offersSortList() {
    if(this.#point.offers.length === 0) {
      return '';
    }
    return this.#point.offers.map((item) => `
      <li class="event__offer">
        <span class="event__offer-title">${item.title}</span>
        +€&nbsp;
        <span class="event__offer-price">${item.price}</span>
      </li>
  `).join('');
  }

  getFavoriteBtnClass() {
    return `event__favorite-btn ${this.#point.isFavorite ? 'event__favorite-btn--active' : ''}`;
  }

  constructPointsTemplate() {
    if(!this.#point) {
      return '';
    }
    this.calculatePrice();

    return `
      <li class="trip-events__item">
        <div class="event">
          <time
            class="event__date"
            datetime="${humanizeDateFormat(this.#point.dateFrom, 'YYYY-MM-DD')}"
          >
            ${humanizeDateFormat(this.#point.dateFrom)}
          </time>
          <div class="event__type">
            <img
              class="event__type-icon"
              width="42"
              height="42"
              src="${iconsCollection[this.#point.type]}"
              alt="Event type icon"
            >
          </div>
          <h3 class="event__title">${this.#point.type} ${ this.#point.destination.name}</h3>
          <div class="event__schedule">
            <p class="event__time">
              <time
                class="event__start-time"
                datetime="${humanizeDateFormat(this.#point.dateFrom, 'YYYY-MM-DD[T]HH:mm')}"
              >
                ${humanizeDateFormat(this.#point.dateFrom, 'HH:mm')}
              </time>
              &mdash;
              <time
                class="event__end-time"
                datetime="${humanizeDateFormat(this.#point.dateTo, 'YYYY-MM-DD[T]HH:mm')}"
              >
                ${humanizeDateFormat(this.#point.dateTo, 'HH:mm')}
              </time>
            </p>
            <p class="event__duration">${humanizeDuration(this.#point.dateFrom, this.#point.dateTo)}</p>
          </div>
          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${this.#price}</span>
          </p>
          <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
            ${this.offersSortList()}
          </ul>
          <button class="${this.getFavoriteBtnClass()}" type="button">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
      </li>
    `;
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  get template() {
    return this.constructPointsTemplate();
  }
}
