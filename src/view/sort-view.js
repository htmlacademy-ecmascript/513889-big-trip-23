import AbstractView from '../framework/view/abstract-view';
import {SortType, DISABLED_SORT_TYPE} from '../constants/constants';
export default class SortView extends AbstractView {
  #handleSortTypeChange = null;
  #currentSortType = null;

  constructor(onSortTypeChange, currentSortType) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;
    this.#currentSortType = currentSortType;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

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
          ${DISABLED_SORT_TYPE.includes(item) ? 'disabled' : ''}
          data-sort-type="${item}"
        >
        <label class="trip-sort__btn" for="sort-${item}">${item}</label>
      </div>
    `;
  }

  #constructSortTemplate() {
    return `
      <form class="trip-events__trip-sort trip-sort" action="#" method="get">
        ${Object.values(SortType).map((item) => this.#constructSortList(item, this.#currentSortType === item))
    .join('')}
      </form>
    `;
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };

  get template() {
    return this.#constructSortTemplate();
  }
}
