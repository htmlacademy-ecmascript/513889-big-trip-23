import InfoMainView from '../view/info-main-view';
import InfoCostView from '../view/info-cost-view';
import SortView from '../view/sort-view';
import EmptyView from '../view/empty-view';
import NewPointButtonView from '../view/new-point-button-view';
import PointsModel from '../models/points-model';
import FilterModel from '../models/filter-model';
import PointPresenter from '../presenters/point-presenter';
import FilterPresenter from '../presenters/filter-presenter.js';
import NewPointPresenter from './new-point-presenter';
import {remove, render, RenderPosition} from '../framework/render';
import {sortListByDate, sortListByPrice, sortListByTime} from '../utils/common';
import {SortType, UpdateType, UserAction, FilterType} from '../constants/constants';
import {filter} from '../utils/filters';

export default class MainPresenter {
  #pointsModel = new PointsModel();
  #filterModel = new FilterModel();
  #infoContainerElement = document.querySelector('#info-container');
  #sortContainerElement = document.querySelector('#sort-container');
  #tripMainElement = document.querySelector('.trip-main');
  #sortComponent = null;
  #noPointComponent = null;
  #newPointButtonComponent = null;
  #filterPresenter = null;
  #pointPresenters = new Map();
  #newPointPresenter = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  constructor() {
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#newPointPresenter = new NewPointPresenter(
      this.#pointsModel.destinations,
      this.#pointsModel.offers,
      this.#handleViewAction,
      this.#handleNewTaskFormClose,
    );
    this.#filterPresenter = new FilterPresenter(
      this.#filterModel,
      this.#pointsModel
    );
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortListByDate);
      case SortType.PRICE:
        return filteredPoints.sort(sortListByPrice);
      case SortType.TIME:
        return filteredPoints.sort(sortListByTime);
      default:
        return filteredPoints;
    }
  }

  init() {
    render(new InfoMainView(), this.#infoContainerElement);
    render(new InfoCostView(this.#pointsModel.calculateTotalPrice), this.#infoContainerElement);
    this.#renderNewPointButton();
    this.#renderBoard();
  }

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(this.#pointsModel.points.find(({id}) => id === data.id));
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard(true);
        this.#renderBoard();
        break;
    }
  };

  #renderBoard = () => {
    this.#filterPresenter.init();

    if(this.points.length === 0) {
      this.#renderNoPoints();
      return;
    }
    this.#sortComponent = new SortView(this.#handleSortTypeChange, this.#currentSortType);
    render(this.#sortComponent, this.#sortContainerElement);
    this.points.forEach((point) => this.#renderPoint(point));
  };

  #clearBoard = (resetSortType = false) => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#noPointComponent);

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #handleNewTaskFormClose = () => {
    this.#newPointButtonComponent.element.disabled = false;
  };

  #handleNewPointButtonClick = () => {
    this.#createPoint();
    this.#newPointButtonComponent.element.disabled = true;
  };

  #createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  }

  #renderNewPointButton() {
    this.#newPointButtonComponent = new NewPointButtonView(this.#handleNewPointButtonClick);
    render(this.#newPointButtonComponent, this.#tripMainElement);
  }

  #renderNoPoints() {
    this.#noPointComponent = new EmptyView(this.#filterType);
    render(this.#noPointComponent, this.#sortContainerElement, RenderPosition.AFTERBEGIN);
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(
      this.#pointsModel.destinations,
      this.#pointsModel.offers,
      this.#handleViewAction,
      this.#handleModeChange
    );
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  };
}
