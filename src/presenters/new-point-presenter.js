import {remove, render, RenderPosition} from '../framework/render.js';
import EditView from '../view/edit-view';
import {nanoid} from 'nanoid';
import {UpdateType, UserAction} from '../constants/constants';

export default class NewPointPresenter {
  #destinations = null;
  #offers = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #pointListContainer = document.querySelector('#points-container');

  #pointEditComponent = null;

  constructor(destinations, offers, onDataChange, onDestroy) {
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new EditView({
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: this.#handleFormSubmit,
      onFormDeleteClick: this.#handleDeleteClick
    });

    render(this.#pointEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {id: nanoid(), ...point},
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
