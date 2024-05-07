import AbstractView from '../framework/view/abstract-view';

export default class SortView extends AbstractView {
  filtersList = ['Day', 'Event', 'Time', 'Price', 'Offers'];

  #constructSortList() {
    return this.filtersList.map((item, i) => `
      <div class="trip-sort__item  trip-sort__item--${item.toLocaleLowerCase()}">
        <input
          id="sort-${item.toLocaleLowerCase()}"
          class="trip-sort__input  visually-hidden"
          type="radio"
          name="trip-sort"
          value="sort-${item.toLocaleLowerCase()}"
          ${i === 0 ? 'checked' : ''}
        >
        <label class="trip-sort__btn" for="sort-${item.toLocaleLowerCase()}">${item}</label>
      </div>
    `).join('');
  }

  #constructSortTemplate() {
    return `
      <form class="trip-events__trip-sort trip-sort" action="#" method="get">
        ${this.#constructSortList()}
      </form>
    `;
  }

  get template() {
    return this.#constructSortTemplate();
  }
}
