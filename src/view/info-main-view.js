import {createElement} from '../render';

export default class InfoMainView {
  infoTitle = 'Amsterdam - Chamonix - Geneva';
  infoDates = '18 - 20 Mar';

  getTemplate() {
    return `
      <div class="trip-info__main">
        <h1 class="trip-info__title">${this.infoTitle}</h1>
        <p class="trip-info__dates">${this.infoDates}</p>
      </div>
    `;
  }

  getElement() {
    if(!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }
}
