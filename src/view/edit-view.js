import AbstractView from '../framework/view/abstract-view';
import { iconsCollection, eventsCollection } from '../constants/constants';
import { humanizeDateCalendarFormat } from '../utils/utils';

export default class EditView extends AbstractView {
  #point = {};
  #destinations;
  #offers;
  #price = 0;
  #handleFormSubmit;
  #handleFormCloseClick;

  constructor(
    point,
    destinations,
    offers,
    onFormSubmit,
    onFormCloseClick,
  ) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormCloseClick = onFormCloseClick;

    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formCloseClickHandler);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };

  #formCloseClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormCloseClick();
  };

  calculatePrice() {
    this.#point.offers?.forEach((offer) => {
      this.#price += offer.price;
    });
  }

  constructEventTypeList() {
    return eventsCollection.map((event) => `
      <div class="event__type-item">
        <input
          id="event-type-${event}-${this.#point.id}"
          class="event__type-input visually-hidden"
          type="radio"
          name="event-type"
          value="${event}"
        >
        <label class="event__type-label event__type-label--${event}" for="event-type-${event}-${this.#point.id}">
          ${event.charAt(0).toUpperCase()}${event.slice(1)}
        </label>
      </div>
    `).join('');
  }

  constructDestinationList() {
    return this.#destinations.map(({name}) => `
      <option value="${name}"></option>
    `).join('');
  }

  constructOffersList() {
    return this.#offers.find(({type}) => type === this.#point.type)?.offers.map((offer) => {
      const titleLastWord = offer.title.split(' ').pop();
      return `
        <div class="event__offer-selector">
          <input
            class="event__offer-checkbox visually-hidden"
            id="event-offer-${titleLastWord}-${this.#point.id}"
            type="checkbox"
            name="event-offer-${titleLastWord}"
            ${this.#point.offers.some(({id}) => id === offer.id) ? 'checked' : ''}
          >
          <label class="event__offer-label" for="event-offer-${titleLastWord}-${this.#point.id}">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
        </div>
      `;
    }).join('') || '';
  }

  constructEditTemplate() {
    this.calculatePrice();
    return `
      <li class="trip-events__item">
        <form class="event event--edit" action="#" method="post">
          <header class="event__header">
            <div class="event__type-wrapper">
              <label class="event__type event__type-btn" for="event-type-toggle-1">
                <span class="visually-hidden">Choose event type</span>
                <img class="event__type-icon" width="17" height="17" src="${iconsCollection[this.#point.type]}" alt="Event type icon">
              </label>
              <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">

              <div class="event__type-list">
                <fieldset class="event__type-group">
                  <legend class="visually-hidden">Event type</legend>

                  ${this.constructEventTypeList()}
                </fieldset>
              </div>
            </div>

            <div class="event__field-group event__field-group--destination">
              <label class="event__label event__type-output" for="event-destination-${this.#point.id}">
                ${this.#point.type}
              </label>
              <input
                class="event__input event__input--destination"
                id="event-destination-${this.#point.id}"
                type="text"
                name="event-destination-${this.#point.id}"
                value="${this.#point.destination.name}"
                list="destination-list-${this.#point.id}"
              >
              <datalist id="destination-list-${this.#point.id}">
                ${this.constructDestinationList()}
              </datalist>
            </div>

            <div class="event__field-group event__field-group--time">
              <label class="visually-hidden" for="event-start-time-${this.#point.id}">From</label>
              <input
                class="event__input event__input--time"
                id="event-start-time-${this.#point.id}"
                type="text"
                name="event-start-time"
                value="${humanizeDateCalendarFormat(this.#point.dateFrom)}"
              >
              &mdash;
              <label class="visually-hidden" for="event-end-time-${this.#point.id}">To</label>
              <input
                class="event__input event__input--time"
                id="event-end-time-${this.#point.id}"
                type="text"
                name="event-end-time"
                value="${humanizeDateCalendarFormat(this.#point.dateTo)}"
              >
            </div>

            <div class="event__field-group event__field-group--price">
              <label class="event__label" for="event-price-${this.#point.id}">
                <span class="visually-hidden">Price</span>
                &euro;
              </label>
              <input
                class="event__input event__input--price"
                id="event-price-${this.#point.id}"
                type="text"
                name="event-price"
                value="${this.#price}"
               >
            </div>

            <button class="event__save-btn btn btn--blue" type="submit">Save</button>
            <button class="event__reset-btn" type="reset">Delete</button>
            <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Open event</span>
            </button>
          </header>
          <section class="event__details">
            <section class="event__section  event__section--offers">
              <h3 class="event__section-title  event__section-title--offers">Offers</h3>

              <div class="event__available-offers">
                ${this.constructOffersList()}
              </div>
            </section>

            <section class="event__section  event__section--destination">
              <h3 class="event__section-title  event__section-title--destination">Destination</h3>
              <p class="event__destination-description">
                ${this.#point.destination.description}
              </p>
            </section>
          </section>
        </form>
      </li>
    `;
  }

  get template() {
    return this.constructEditTemplate();
  }
}
