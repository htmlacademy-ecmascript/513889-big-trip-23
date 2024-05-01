import {createElement} from '../render';

export default class InfoCostView {
  infoCost = '1230';

  getTemplate() {
    return `
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${this.infoCost}</span>
      </p>
    `;
  }

  getElement() {
    if(!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }
}
