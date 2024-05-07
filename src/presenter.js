import FiltersView from './view/filters-view';
import SortView from './view/sort-view';
import PointsView from './view/points-view';
import InfoMainView from './view/info-main-view';
import InfoCostView from './view/info-cost-view';
import EditView from './view/edit-view';
import PointsModel from './models/points-model';
import {render, replace} from './framework/render';

export default class Presenter {
  #pointsModel = new PointsModel();
  #filtersContainerElement = document.querySelector('#filters-container');
  #sortContainerElement = document.querySelector('#sort-container');
  #itemsContainerElement = document.querySelector('#items-container');
  #infoContainerElement = document.querySelector('#info-container');

  init() {
    render(new FiltersView(), this.#filtersContainerElement);
    render(new SortView(), this.#sortContainerElement);
    render(new InfoMainView(), this.#infoContainerElement);
    render(new InfoCostView(this.#pointsModel.calculateTotalPrice), this.#infoContainerElement);

    this.#pointsModel.constructPointsList.forEach((item) => {
      this.#renderPoint(item);
    });
  }

  #renderPoint = (point) => {
    const pointComponent = new PointsView(point, onEditClick);
    const pointEditComponent = new EditView(
      point,
      this.#pointsModel.destinations,
      this.#pointsModel.offers,
      onFormSubmit,
      onFormCloseClick
    );

    const escKeyDownHandler = (evt) => {
      if (evt.key !== 'Escape') {
        return;
      }

      evt.preventDefault();
      replace(pointComponent, pointEditComponent);
      document.removeEventListener('keydown', escKeyDownHandler);
    };

    function onEditClick() {
      replace(pointEditComponent, pointComponent);
      document.addEventListener('keydown', escKeyDownHandler);
    }

    function onFormSubmit() {
      replace(pointComponent, pointEditComponent);
      document.removeEventListener('keydown', escKeyDownHandler);
    }

    function onFormCloseClick() {
      replace(pointComponent, pointEditComponent);
      document.removeEventListener('keydown', escKeyDownHandler);
    }

    render(pointComponent, this.#itemsContainerElement);
  };
}
