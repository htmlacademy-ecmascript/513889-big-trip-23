import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { EVENT_TYPES } from '../constants/constants';
import {humanizeDateCalendarFormat, toCapitalize} from '../utils/common';

export default class EditView extends AbstractStatefulView {
  #point = null;
  #destinations = null;
  #offers = null;
  #price = 0;
  #handleFormSubmit = null;
  #handleFormCloseClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor(
    point,
    destinations,
    offers,
    onFormSubmit,
    onFormCloseClick,
  ) {
    super();
    this._setState({...point});
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormCloseClick = onFormCloseClick;

    this._restoreHandlers();
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  _restoreHandlers() {
    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formCloseClickHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__field-group--price').addEventListener('change', this.#priceChangeHandler);
    if (this.element.querySelector('.event__section--offers')) {
      this.element.querySelector('.event__section--offers').addEventListener('change', this.#offerChangeHandler);
    }
    this.#setDatepickerFrom();
    this.#setDatepickerTo();
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit({...this._state});
  };

  #formCloseClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormCloseClick();
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName === 'INPUT') {
      this.updateElement({
        type: evt.target.value,
        offers: [],
      });
    }
  };

  #destinationChangeHandler = (evt) => {
    const name = evt.target.value;
    const newDestination = this.#destinations.find((destination) => destination.name === name);

    if (!newDestination) {
      return;
    }

    this.updateElement({
      destination: newDestination,
    });
  };

  #priceChangeHandler = (evt) => {
    const newBasePrice = evt.target.value;
    if (newBasePrice && !/^[\\D0]+|\\D/g.test(newBasePrice)) {
      this.updateElement({
        basePrice: newBasePrice,
      });
    }
  };

  #offerChangeHandler = (evt) => {
    evt.preventDefault();
    const inputs = this.element.querySelector('.event__available-offers').querySelectorAll('input');
    const offers = [];

    for (const input of inputs) {
      if (input.checked) {
        offers.push(input.id);
      }
    }

    this._state.offers = offers;
    this._setState(this._state.offers);
  };

  #setDatepickerFrom = () => {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector(`#event-start-time-${this.#point.id}`),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        enableTime: true,
        'time_24hr': true,
        onClose: this.#dateFromCloseHandler,
      }
    );
  };

  #setDatepickerTo = () => {
    this.#datepickerTo = flatpickr(
      this.element.querySelector(`#event-end-time-${this.#point.id}`),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        minDate: this.#datepickerFrom.selectedDates[0],
        enableTime: true,
        'time_24hr': true,
        onClose: this.#dateToCloseHandler,
      }
    );
  };

  #dateFromCloseHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #dateToCloseHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  resetForm = (point) => {
    this.updateElement({...point});
  };

  #calculatePrice() {
    this.#point.offers?.forEach((offer) => {
      this.#price += offer.price;
    });
  }

  #constructEventTypeList() {
    return EVENT_TYPES.map((event) => `
      <div class="event__type-item">
        <input
          id="event-type-${event}-${this.#point.id}"
          class="event__type-input visually-hidden"
          type="radio"
          name="event-type"
          value="${event}"
        >
        <label class="event__type-label event__type-label--${event}" for="event-type-${event}-${this.#point.id}">
          ${toCapitalize(event)}
        </label>
      </div>
    `).join('');
  }

  #constructDestinationList() {
    return this.#destinations.map(({name}) => `
      <option value="${name}"></option>
    `).join('');
  }

  #constructOffersList() {
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

  #constructEditTemplate(state) {
    this.#calculatePrice();
    return `
      <li class="trip-events__item">
        <form class="event event--edit" action="#" method="post">
          <header class="event__header">
            <div class="event__type-wrapper">
              <label class="event__type event__type-btn" for="event-type-toggle-1">
                <span class="visually-hidden">Choose event type</span>
                <img class="event__type-icon" width="17" height="17" src="img/icons/${state.type}.png" alt="Event type icon">
              </label>
              <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">

              <div class="event__type-list">
                <fieldset class="event__type-group">
                  <legend class="visually-hidden">Event type</legend>

                  ${this.#constructEventTypeList()}
                </fieldset>
              </div>
            </div>

            <div class="event__field-group event__field-group--destination">
              <label class="event__label event__type-output" for="event-destination-${state.id}">
                ${state.type}
              </label>
              <input
                class="event__input event__input--destination"
                id="event-destination-${state.id}"
                type="text"
                name="event-destination-${state.id}"
                value="${state.destination.name}"
                list="destination-list-${state.id}"
              >
              <datalist id="destination-list-${state.id}">
                ${this.#constructDestinationList()}
              </datalist>
            </div>

            <div class="event__field-group event__field-group--time">
              <label class="visually-hidden" for="event-start-time-${state.id}">From</label>
              <input
                class="event__input event__input--time"
                id="event-start-time-${state.id}"
                type="text"
                name="event-start-time"
                value="${humanizeDateCalendarFormat(state.dateFrom)}"
              >
              &mdash;
              <label class="visually-hidden" for="event-end-time-${state.id}">To</label>
              <input
                class="event__input event__input--time"
                id="event-end-time-${state.id}"
                type="text"
                name="event-end-time"
                value="${humanizeDateCalendarFormat(state.dateTo)}"
              >
            </div>

            <div class="event__field-group event__field-group--price">
              <label class="event__label" for="event-price-${state.id}">
                <span class="visually-hidden">Price</span>
                &euro;
              </label>
              <input
                class="event__input event__input--price"
                id="event-price-${state.id}"
                type="text"
                name="event-price"
                value="${state.basePrice}"
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
                ${this.#constructOffersList()}
              </div>
            </section>

            <section class="event__section  event__section--destination">
              <h3 class="event__section-title  event__section-title--destination">Destination</h3>
              <p class="event__destination-description">
                ${state.destination.description}
              </p>
              <div class="event__photos-container">
                <div class="event__photos-tape">
                  ${state.destination.pictures.map((picture) => `
                    <img class="event__photo" src="${picture.src}" alt="${picture.description}">
                  `)}
              </div>
            </section>
          </section>
        </form>
      </li>
    `;
  }

  get template() {
    return this.#constructEditTemplate(this._state);
  }
}
