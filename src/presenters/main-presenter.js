import FiltersView from '../view/filters-view';
import InfoMainView from '../view/info-main-view';
import InfoCostView from '../view/info-cost-view';
import SortView from '../view/sort-view';
import EmptyView from '../view/empty-view';
import PointsModel from '../models/points-model';
import PointPresenter from '../presenters/point-presenter';
import {remove, render} from '../framework/render';
import {generateFilter} from '../utils/filters';
import {updateItem, sortListByDate, sortListByEvent, sortListByPrice, sortListByTime} from '../utils/common';
import {SortTypes} from '../constants/constants';

export default class MainPresenter {
  #pointsModel = new PointsModel();
  #filtersContainerElement = document.querySelector('#filters-container');
  #infoContainerElement = document.querySelector('#info-container');
  #sortContainerElement = document.querySelector('#sort-container');
  #sortComponent = null;
  #pointPresenters = new Map();
  #pointsList = [];
  #currentSortType = SortTypes.DAY;
  #sourcedPointsList = [];

  init() {
    this.#pointsList = [...this.#pointsModel.constructPointsList];
    this.#sourcedPointsList = [...this.#pointsModel.constructPointsList];

    const filters = generateFilter(this.#pointsList);
    render(new FiltersView(filters), this.#filtersContainerElement);
    render(new InfoMainView(), this.#infoContainerElement);
    render(new InfoCostView(this.#pointsModel.calculateTotalPrice), this.#infoContainerElement);
    this.#renderSort();
    this.#renderPointsList();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#pointsList = updateItem(this.#pointsList, updatedPoint);
    this.#sourcedPointsList = updateItem(this.#sourcedPointsList, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #sortTasks(sortType) {
    switch (sortType) {
      case SortTypes.DAY:
        this.#pointsList.sort(sortListByDate);
        break;
      case SortTypes.EVENT:
        this.#pointsList.sort(sortListByEvent);
        break;
      case SortTypes.PRICE:
        this.#pointsList.sort(sortListByPrice);
        break;
      case SortTypes.TIME:
        this.#pointsList.sort(sortListByTime);
        break;
      default:
        this.#pointsList = [...this.#sourcedPointsList];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortTasks(sortType);
    this.#clearPointsList();
    this.#renderPointsList();
    this.#clearSort();
    this.#renderSort();
  };

  #renderPointsList() {
    if(this.#pointsList.length === 0) {
      render(new EmptyView(this.#pointsModel.filters[0]), this.#sortContainerElement);
    } else {
      this.#pointsList.forEach((point) => this.#renderPoint(point));
    }
  }

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

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#handleSortTypeChange, this.#currentSortType);
    render(this.#sortComponent, this.#sortContainerElement);
  };

  #clearPointsList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #clearSort() {
    remove(this.#sortComponent);
  }
}
