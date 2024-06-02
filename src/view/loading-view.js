import AbstractView from '../framework/view/abstract-view.js';

export default class LoadingView extends AbstractView {

  createLoadingTemplate() {
    return (
      `<div class="page-body__container">
        <section class="trip-events">
          <h2 class="visually-hidden">Trip events</h2>

          <p class="trip-events__msg">Loading...</p>
        </section>
      </div>`
    );
  }

  get template() {
    return this.createLoadingTemplate();
  }
}
