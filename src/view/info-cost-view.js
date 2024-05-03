import {createElement} from '../render';

export default class InfoCostView {
  totalPrice = 0;

  constructor(totalPrice) {
    this.totalPrice = totalPrice;
  }

  getTemplate() {
    return `
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${this.totalPrice}</span>
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
