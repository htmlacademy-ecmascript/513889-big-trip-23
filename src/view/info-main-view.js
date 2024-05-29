import AbstractView from '../framework/view/abstract-view';

export default class InfoMainView extends AbstractView {
  #infoTitle = '';
  #infoDates = '';

  constructor(destinationsNames, pointsInfoDates) {
    super();
    this.#infoTitle = destinationsNames;
    this.#infoDates = pointsInfoDates;
  }

  #constructMainTemplate() {
    return `
      <div class="trip-info__main">
        <h1 class="trip-info__title">${this.#infoTitle}</h1>
        <p class="trip-info__dates">${this.#infoDates}</p>
      </div>
    `;
  }

  get template() {
    return this.#constructMainTemplate();
  }
}
