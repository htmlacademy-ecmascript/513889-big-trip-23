import FiltersView from '../view/filters-view';
import InfoMainView from '../view/info-main-view';
import InfoCostView from '../view/info-cost-view';
import SortView from '../view/sort-view';
import EmptyView from '../view/empty-view';
import PointsModel from '../models/points-model';
import PointPresenter from '../presenters/point-presenter';
import {render} from '../framework/render';
import {generateFilter} from '../utils/filters';
import {updateItem} from '../utils/common';

export default class MainPresenter {
  #pointsModel = new PointsModel();
  #filtersContainerElement = document.querySelector('#filters-container');
  #infoContainerElement = document.querySelector('#info-container');
  #sortContainerElement = document.querySelector('#sort-container');
  #pointPresenters = new Map();
  #pointsList = [];

  init() {
    this.#pointsList = [...this.#pointsModel.constructPointsList];
    const filters = generateFilter(this.#pointsList);
    render(new FiltersView(filters), this.#filtersContainerElement);
    render(new InfoMainView(), this.#infoContainerElement);
    render(new InfoCostView(this.#pointsModel.calculateTotalPrice), this.#infoContainerElement);
    render(new SortView(), this.#sortContainerElement);

    if(this.#pointsList.length === 0) {
      render(new EmptyView(this.#pointsModel.filters[0]), this.#sortContainerElement);
    } else {
      this.#pointsList.forEach((point) => this.#renderPoint(point));
    }
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#pointsList = updateItem(this.#pointsList, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(
      this.#pointsModel.destinations,
      this.#pointsModel.offers,
      this.#handlePointChange,
      this.#handleModeChange
    );
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  };
}
