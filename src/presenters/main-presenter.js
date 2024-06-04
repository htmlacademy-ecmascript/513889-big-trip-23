import SortView from '../view/sort-view';
import EmptyView from '../view/empty-view';
import NewPointButtonView from '../view/new-point-button-view';
import LoadingView from '../view/loading-view.js';
import PointsModel from '../models/points-model';
import FilterModel from '../models/filter-model';
import PointPresenter from '../presenters/point-presenter';
import FilterPresenter from '../presenters/filter-presenter.js';
import PointInfoPresenter from './point-info-presenter';
import NewPointPresenter from './new-point-presenter';
import {remove, render, RenderPosition} from '../framework/render';
import {sortListByDate, sortListByPrice, sortListByTime} from '../utils/common';
import {SortType, UpdateType, UserAction, FilterType, TimeLimit, END_POINT, AUTHORIZATION} from '../constants/constants';
import {filter} from '../utils/filters';
import PointsApiService from '../points-api-service';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

export default class MainPresenter {
  #pointsModel = new PointsModel(new PointsApiService(END_POINT, AUTHORIZATION));
  #filterModel = new FilterModel();
  #sortContainerElement = document.querySelector('#sort-container');
  #tripMainElement = document.querySelector('.trip-main');
  #pageMainElement = document.querySelector('.page-main');
  #sortComponent = null;
  #noPointComponent = null;
  #newPointButtonComponent = null;
  #loadingComponent = new LoadingView();
  #filterPresenter = null;
  #pointInfoPresenter = null;
  #pointPresenters = new Map();
  #newPointPresenter = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor () {
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
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
    this.#initFilterPresenter();
    this.#initPointInfoPresenter();
    this.#renderBoard();
    this.#pointsModel.init().finally(() => {
      this.#renderNewPointButton();
    });
  }

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #renderBoard = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    this.#initNewPointPresenter();
    this.#pointInfoPresenter.init();
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

    remove(this.#loadingComponent);
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

  #handleNewPointFormClose = () => {
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

  #renderLoading() {
    render(this.#loadingComponent, this.#pageMainElement, RenderPosition.AFTERBEGIN);
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

  #initNewPointPresenter = () => {
    this.#newPointPresenter = new NewPointPresenter(
      this.#pointsModel.destinations,
      this.#pointsModel.offers,
      this.#handleViewAction,
      this.#handleNewPointFormClose,
    );
  };

  #initFilterPresenter = () => {
    this.#filterPresenter = new FilterPresenter(this.#filterModel, this.#pointsModel);
  };

  #initPointInfoPresenter = () => {
    this.#pointInfoPresenter = new PointInfoPresenter(this.#pointsModel);
  };
}
