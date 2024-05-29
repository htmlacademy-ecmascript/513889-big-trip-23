import { remove, render, replace } from '../framework/render';
import InfoMainView from '../view/info-main-view';
import InfoCostView from '../view/info-cost-view';

export default class PointInfoPresenter {
  #pointsModel = null;
  #infoContainerElement = document.querySelector('#info-container');

  #infoMainComponent = null;
  #infoCostComponent = null;

  constructor(pointsModel) {
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    const prevInfoMainComponent = this.#infoMainComponent;
    const prevInfoCostComponent = this.#infoCostComponent;

    this.#infoMainComponent = new InfoMainView(this.#pointsModel.destinationsNames, this.#pointsModel.pointsInfoDates);
    this.#infoCostComponent = new InfoCostView(this.#pointsModel.calculateTotalPrice);

    if (prevInfoMainComponent === null) {
      render(this.#infoMainComponent, this.#infoContainerElement);
      render(this.#infoCostComponent, this.#infoContainerElement);
      return;
    }

    if (prevInfoCostComponent === null) {
      render(this.#infoMainComponent, this.#infoContainerElement);
      render(this.#infoCostComponent, this.#infoContainerElement);
      return;
    }

    replace(this.#infoMainComponent, prevInfoMainComponent);
    replace(this.#infoCostComponent, prevInfoCostComponent);

    remove(prevInfoMainComponent);
    remove(prevInfoCostComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };
}
