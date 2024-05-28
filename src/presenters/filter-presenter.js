import {render, replace, remove} from '../framework/render.js';
import FiltersView from '../view/filters-view';
import {FilterType, UpdateType} from '../constants/constants';
import {filter} from '../utils/filters';

export default class FilterPresenter {
  #filterModel = null;
  #pointsModel = null;
  #filtersContainerElement = document.querySelector('#filters-container');

  #filterComponent = null;

  constructor(filterModel, pointsModel) {
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const points = this.#pointsModel.points;

    return Object.values(FilterType).map((type) => ({
      type,
      count: filter[type](points).length
    }));
  }

  init() {
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FiltersView(
      this.filters,
      this.#filterModel.filter,
      this.#handleFilterTypeChange
    );

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filtersContainerElement);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => this.init();

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
