import {createElement} from '../render';

export default class SortView {
  filtersList = ['Day', 'Event', 'Time', 'Price', 'Offers'];

  constructSortList() {
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

  getTemplate() {
    return `
      <form class="trip-events__trip-sort trip-sort" action="#" method="get">
        ${this.constructSortList()}
      </form>
    `;
  }

  getElement() {
    if(!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }
}
