import AbstractView from '../framework/view/abstract-view';

export default class InfoCostView extends AbstractView {
  #totalPrice = 0;

  constructor(totalPrice) {
    super();
    this.#totalPrice = totalPrice;
  }

  #constructCostTemplate() {
    return `
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${this.#totalPrice}</span>
      </p>
    `;
  }

  get template() {
    return this.#constructCostTemplate();
  }
}
