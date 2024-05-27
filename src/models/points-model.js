import pointsMock from '../mocks/points-mock.json';
import offersMock from '../mocks/offers-mock.json';
import destinationsMock from '../mocks/destinations-mock.json';
import {FilterType} from '../constants/constants';
import {sortListByDate} from '../utils/common';
import Observable from '../framework/observable';

export default class PointsModel extends Observable{
  #points = pointsMock;
  #offers = offersMock;
  #destinations = destinationsMock;
  #totalPrice = 0;
  #filters = Object.values(FilterType);

  get constructPointsList() {
    return this.#points.map((item) => {
      const destination = this.#destinations.find(({id}) => id === item.destination);
      const offersListByType = this.#offers.find(({type}) => type === item.type);
      const offers = offersListByType && offersListByType.offers.filter(({id}) => item.offers.includes(id));

      return {
        ...item,
        destination,
        offers
      };
    }).sort(sortListByDate) || [];
  }

  get calculateTotalPrice() {
    this.constructPointsList.forEach((point) => {
      this.#totalPrice += point.basePrice;
      point.offers.forEach(({price}) => {
        this.#totalPrice += price;
      });
    });
    return this.#totalPrice;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  get filters() {
    return this.#filters;
  }

  updatePoint(updateType, update) {
    const index = this.constructPointsList.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  }
}
