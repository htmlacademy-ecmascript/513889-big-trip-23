import AbstractView from '../framework/view/abstract-view';

export default class FiltersView extends AbstractView {
  #filters = [];
  #currentFilter = '';

  constructor(filters, currentFilter) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilter;
  }

  #constructFiltersList({ type, count }, isChecked) {
    return `
      <div class="trip-filters__filter">
        <input
          id="filter-${type}"
          class="trip-filters__filter-input  visually-hidden"
          type="radio"
          name="trip-filter"
          value="${type}"
          ${isChecked ? 'checked' : ''}
          ${count === 0 ? 'disabled' : ''}
        >
        <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
      </div>
    `;
  }

  #constructFiltersTemplate() {
    return `
      <form class="trip-filters" action="#" method="get">
        ${this.#filters.map((item) => this.#constructFiltersList(item, item === this.#currentFilter)).join('')}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>
    `;
  }

  get template() {
    return this.#constructFiltersTemplate();
  }
}
