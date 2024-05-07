import AbstractView from '../framework/view/abstract-view';

export default class FiltersView extends AbstractView {
  #filtersList = ['Everything', 'Future', 'Present', 'Past'];

  constructFiltersList() {
    return this.#filtersList.map((item, i) => `
      <div class="trip-filters__filter">
        <input
          id="filter-${item}"
          class="trip-filters__filter-input  visually-hidden"
          type="radio"
          name="trip-filter"
          value="${item}"
          ${i === 0 ? 'checked' : ''}
        >
        <label class="trip-filters__filter-label" for="filter-${item}">${item}</label>
      </div>
    `).join('');
  }

  constructFiltersTemplate() {
    return `
      <form class="trip-filters" action="#" method="get">
        ${this.constructFiltersList()}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>
    `;
  }

  get template() {
    return this.constructFiltersTemplate();
  }
}
