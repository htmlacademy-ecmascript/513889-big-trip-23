import PointsView from '../view/points-view';
import EditView from '../view/edit-view';
import {render, replace, remove} from '../framework/render';
import {Mode} from '../constants/constants';

export default class PointPresenter {
  #point = null;
  #destinations = null;
  #offers = null;
  #pointContainerElement = document.querySelector('#points-container');
  #pointComponent = null;
  #pointEditComponent = null;
  #mode = Mode.DEFAULT = null;
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
    this.#pointEditComponent = new EditView(
      this.#point,
      this.#destinations,
      this.#offers,
      this.#handleFormSubmit,
      this.#handleEditCloseClick,
    );

    if(prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointContainerElement);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
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
    if (this.#mode !== Mode.DEFAULT) {
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
    this.#mode = Mode.DEFAULT;
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

  #handleFormSubmit = (point) => {
    this.#handleDataChange(point);
    this.#replaceFormToCard();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#point, isFavorite: !this.#point.isFavorite});
  };
}
