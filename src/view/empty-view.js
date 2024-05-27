import AbstractView from '../framework/view/abstract-view';
import { TripEmptyMessages } from '../constants/constants';

export default class FilterView extends AbstractView {
  #filterType = '';

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  #constructSortTemplate(filterType) {
    return `<p class="trip-events__msg">${TripEmptyMessages[filterType]}</p>`;
  }

  get template() {
    return this.#constructSortTemplate(this.#filterType);
  }
}
