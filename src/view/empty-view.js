import AbstractView from '../framework/view/abstract-view';
import { TripEmptyMessages } from '../constants/constants';

export default class FilterView extends AbstractView {
  #filter = '';

  constructor(filter) {
    super();
    this.#filter = filter;
  }

  #constructSortTemplate() {
    return `<p class="trip-events__msg">${TripEmptyMessages[this.#filter]}</p>`;
  }

  get template() {
    return this.#constructSortTemplate();
  }
}
