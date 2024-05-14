import AbstractView from '../framework/view/abstract-view';
import {SortTypes} from '../constants/constants';
export default class SortView extends AbstractView {

  #constructSortList(item, isChecked) {
    return `
      <div class="trip-sort__item  trip-sort__item--${item}">
        <input
          id="sort-${item}"
          class="trip-sort__input visually-hidden"
          type="radio"
          name="trip-sort"
          value="sort-${item}"
          ${isChecked ? 'checked' : ''}
          data-sort-type="${item}"
        >
        <label class="trip-sort__btn" for="sort-${item}">${item}</label>
      </div>
    `;
  }

  #constructSortTemplate() {
    return `
      <form class="trip-events__trip-sort trip-sort" action="#" method="get">
        ${Object.values(SortTypes).map((item, i) => this.#constructSortList(item, i === 0)).join('')}
      </form>
    `;
  }

  get template() {
    return this.#constructSortTemplate();
  }
}
