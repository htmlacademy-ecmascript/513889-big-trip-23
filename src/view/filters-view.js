import AbstractView from '../framework/view/abstract-view';

export default class FiltersView extends AbstractView {
  #filters = [];
  #currentFilter = '';
  #handleFilterTypeChange = null;

  constructor(filters, currentFilter, onFilterTypeChange) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilter;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  #constructFiltersList({ type, count }, currentFilter) {
    return `
      <div class="trip-filters__filter">
        <input
          id="filter-${type}"
          class="trip-filters__filter-input  visually-hidden"
          type="radio"
          name="trip-filter"
          value="${type}"
          ${type === currentFilter ? 'checked' : ''}
          ${count === 0 ? 'disabled' : ''}
        >
        <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
      </div>
    `;
  }

  #constructFiltersTemplate(filters, currentFilter) {
    return `
      <form class="trip-filters" action="#" method="get">
        ${filters.map((item) => this.#constructFiltersList(item, currentFilter)).join('')}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>
    `;
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };

  get template() {
    return this.#constructFiltersTemplate(this.#filters, this.#currentFilter);
  }
}
