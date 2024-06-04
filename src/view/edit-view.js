import flatpickr from 'flatpickr';
import {nanoid} from 'nanoid';
import 'flatpickr/dist/flatpickr.min.css';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { EVENT_TYPES } from '../constants/constants';
import {humanizeDateCalendarFormat, toCapitalize} from '../utils/common';

export default class EditView extends AbstractStatefulView {
  #point = null;
  #destinations = null;
  #offers = null;
  #handleFormSubmit = null;
  #handleFormCloseClick = null;
  #handleFormDeleteClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #isCreateDisabled = false;
  #componentType = 'edit';

  constructor({
    point,
    destinations,
    offers,
    onFormSubmit,
    onFormCloseClick,
    onFormDeleteClick
  }) {
    super();
    if(point) {
      this._setState({...point});
      this.#point = point;
    } else {
      const blankPoint = {
        id: nanoid(),
        basePrice: 0,
        dateFrom: '',
        dateTo: '',
        destination: {},
        isFavorite: false,
        offers: [],
        type: EVENT_TYPES[0]
      };
      this._setState({...blankPoint});
      this.#point = blankPoint;
      this.#componentType = 'new';
      this.#isCreateDisabled = true;
    }
    this.#offers = offers.find(({type}) => type === this._state.type)?.offers;
    this.#destinations = destinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormCloseClick = onFormCloseClick;
    this.#handleFormDeleteClick = onFormDeleteClick;

    this._restoreHandlers();
  }

  get #getIsCreateDisabled () {
    return this.#componentType === 'new' && (
      Object.keys(this._state.destination).length === 0
      || !this._state.dateFrom
      || !this._state.dateTo
      || this._state.basePrice === 0
    );
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
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__field-group--price').addEventListener('change', this.#priceChangeHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
    if (this.element.querySelector('.event__section--offers')) {
      this.element.querySelector('.event__section--offers').addEventListener('change', this.#offerChangeHandler);
    }
    if(this.#componentType === 'edit') {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formCloseClickHandler);
    }
    this.#setDatepickerFrom();
    this.#setDatepickerTo();
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit({
      ...this._state,
      destination: this._state.destination.id,
      offers: this._state.offers?.map(({id}) => id) || []
    });
  };

  #formCloseClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormCloseClick();
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.classList.contains('event__type-input')) {
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
    this.updateElement({
      basePrice: +evt.target.value,
    });
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormDeleteClick({...this._state});
  };

  #offerChangeHandler = (evt) => {
    evt.preventDefault();
    const inputs = this.element.querySelector('.event__available-offers').querySelectorAll('input');
    const offers = [];

    inputs.forEach((input) => {
      if (input.checked) {
        const offer = this.#offers.find(({id}) => id === input.value);
        offers.push(offer);
      }
    });

    this._setState({
      ...this._state,
      offers
    });
  };

  #setDatepickerFrom = () => {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector(`#event-start-time-${this._state.id}`),
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
      this.element.querySelector(`#event-end-time-${this._state.id}`),
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

  #constructEventTypeList() {
    return EVENT_TYPES.map((event) => `
      <div class="event__type-item">
        <input
          id="event-type-${event}"
          class="event__type-input visually-hidden"
          type="radio"
          name="event-type"
          value="${event}"
          ${this._state.type === event ? 'checked' : ''}
        >
        <label class="event__type-label event__type-label--${event}" for="event-type-${event}">
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
    return this.#offers?.map((offer) => {
      const titleLastWord = offer.title.split(' ').pop();
      return `
        <div class="event__offer-selector">
          <input
            class="event__offer-checkbox visually-hidden"
            id="event-offer-${titleLastWord}-${offer.id}"
            type="checkbox"
            name="event-offer-${titleLastWord}"
            value="${offer.id}"
            ${this._state.offers.some(({id}) => id === offer.id) ? 'checked' : ''}
          >
          <label class="event__offer-label" for="event-offer-${titleLastWord}-${offer.id}">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
        </div>
      `;
    }).join('') || '';
  }

  #constructEditTemplate() {
    return `
      <li class="trip-events__item">
        <form class="event event--edit" action="#" method="post">
          <header class="event__header">
            <div class="event__type-wrapper">
              <label class="event__type event__type-btn" for="event-type-toggle-1">
                <span class="visually-hidden">Choose event type</span>
                <img class="event__type-icon" width="17" height="17" src="img/icons/${this._state.type}.png" alt="Event type icon">
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
              <label class="event__label event__type-output" for="event-destination-${this._state.id}">
                ${this._state.type}
              </label>
              <input
                class="event__input event__input--destination"
                id="event-destination-${this._state.id}"
                type="text"
                name="event-destination-${this._state.id}"
                value="${this._state.destination?.name ? this._state.destination?.name : ''}"
                list="destination-list-${this._state.id}"
              >
              <datalist id="destination-list-${this._state.id}">
                ${this.#constructDestinationList()}
              </datalist>
            </div>

            <div class="event__field-group event__field-group--time">
              <label class="visually-hidden" for="event-start-time-${this._state.id}">From</label>
              <input
                class="event__input event__input--time"
                id="event-start-time-${this._state.id}"
                type="text"
                name="event-start-time"
                value="${humanizeDateCalendarFormat(this._state.dateFrom)}"
              >
              &mdash;
              <label class="visually-hidden" for="event-end-time-${this._state.id}">To</label>
              <input
                class="event__input event__input--time"
                id="event-end-time-${this._state.id}"
                type="text"
                name="event-end-time"
                value="${humanizeDateCalendarFormat(this._state.dateTo)}"
              >
            </div>

            <div class="event__field-group event__field-group--price">
              <label class="event__label" for="event-price-${this._state.id}">
                <span class="visually-hidden">Price</span>
                &euro;
              </label>
              <input
                class="event__input event__input--price"
                id="event-price-${this._state.id}"
                type="number"
                name="event-price"
                value="${this._state.basePrice}"
              >
            </div>

            <button
             class="event__save-btn btn btn--blue"
             type="submit"
             ${this.#getIsCreateDisabled ? 'disabled' : ''}
            >
                Save
            </button>
            <button class="event__reset-btn" type="reset">${this.#componentType === 'edit' ? 'Delete' : 'Cancel'}</button>
            ${this.#componentType === 'edit' ? `
              <button class="event__rollup-btn" type="button">
                <span class="visually-hidden">Open event</span>
              </button>
            ` : ''}
          </header>
          ${Object.keys(this._state.destination).length > 0 ? `
            <section class="event__details">

              <section class="event__section  event__section--offers">
                <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                <div class="event__available-offers">
                  ${this.#constructOffersList()}
                </div>
              </section>
              ${this._state.offers.length > 0 ? '' : ''}
              <section class="event__section  event__section--destination">
                <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                <p class="event__destination-description">
                  ${this._state.destination?.description}
                </p>
                <div class="event__photos-container">
                  <div class="event__photos-tape">
                    ${this._state.destination?.pictures?.map((picture) => `
                      <img class="event__photo" src="${picture.src}" alt="${picture.description}">
                    `)}
                </div>
              </section>
            </section>
          ` : ''}
        </form>
      </li>
    `;
  }

  get template() {
    return this.#constructEditTemplate();
  }
}
