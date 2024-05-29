import PointsView from '../view/points-view';
import EditView from '../view/edit-view';
import {render, replace, remove} from '../framework/render';
import {Mode, UpdateType, UserAction} from '../constants/constants';
import {isDatesEqual} from '../utils/common';

export default class PointPresenter {
  #point = null;
  #destinations = null;
  #offers = null;
  #pointContainerElement = document.querySelector('#points-container');
  #pointComponent = null;
  #pointEditComponent = null;
  #mode = Mode.VIEW;
  #handleDataChange = null;
  #handleModeChange = null;

  constructor(destinations, offers, onDataChange, onModeChange) {
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;
    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointsView(this.#point, this.#handleEditClick, this.#handleFavoriteClick);
    this.#pointEditComponent = new EditView({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: this.#handleFormSubmit,
      onFormCloseClick: this.#handleEditCloseClick,
      onFormDeleteClick: this.#handleDeleteClick
    });

    if(prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointContainerElement);
      return;
    }

    if (this.#mode === Mode.VIEW) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.VIEW) {
      this.#replaceFormToCard();
    }
  }

  #replaceCardToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.VIEW;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#pointEditComponent.resetForm(this.#point);
      this.#replaceFormToCard();
    }
  };

  #handleEditClick = () => {
    this.#replaceCardToForm();
  };

  #handleEditCloseClick = () => {
    this.#pointEditComponent.resetForm(this.#point);
    this.#replaceFormToCard();
  };

  #handleFormSubmit = (update) => {
    const isMinorUpdate =
      !isDatesEqual(this.#point.dateFrom, update.dateFrom)
      || !isDatesEqual(this.#point.dateTo, update.dateTo);

    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update
    );
    this.#replaceFormToCard();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {
        ...this.#point,
        isFavorite: !this.#point.isFavorite,
        destination: this.#point.destination.id,
        offers: this.#point.offers.map(({id}) => id)
      },
    );
  };

  #handleDeleteClick = (point) => this.#handleDataChange(UserAction.DELETE_POINT, UpdateType.MINOR, point);
}
