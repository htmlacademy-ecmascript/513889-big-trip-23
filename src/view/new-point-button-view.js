import AbstractView from '../framework/view/abstract-view';

export default class NewPointButtonView extends AbstractView {
  #handleNewPointClick = null;

  constructor(onNewPointClick) {
    super();
    this.#handleNewPointClick = onNewPointClick;
    this.element.addEventListener('click', this.#newPointClickHandler);
  }

  #createNewPointButtonTemplate() {
    return `
      <button class="trip-main__event-add-btn btn btn--big btn--yellow" type="button">
        New event
      </button>
  `;
  }

  get template() {
    return this.#createNewPointButtonTemplate();
  }

  #newPointClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleNewPointClick();
  };
}
