import pointsMock from '../mocks/points-mock.json';
import offersMock from '../mocks/offers-mock.json';
import destinationsMock from '../mocks/destinations-mock.json';
import {FilterType} from '../constants/constants';
import {humanizeDateFormat, isDatesInOneMonth, sortListByDate} from '../utils/common';
import Observable from '../framework/observable';

export default class PointsModel extends Observable{
  #points = pointsMock;
  #offers = offersMock;
  #destinations = destinationsMock;
  #filters = Object.values(FilterType);

  get points() {
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
    return this.points.reduce((acc, item) => {
      acc += item.basePrice;
      item.offers.forEach(({price}) => {
        acc += price;
      });
      return acc;
    }, 0);
  }

  get destinationsNames() {
    const destinationsNamesArr = this.points.map(({destination}) => destination.name);

    switch (destinationsNamesArr.length) {
      case 0:
        return '';
      case 1:
        return destinationsNamesArr[0];
      case 2:
      case 3:
        return destinationsNamesArr.join(' — ');
      default:
        return `${destinationsNamesArr[0]} — ... — ${destinationsNamesArr[destinationsNamesArr.length - 1]}`;
    }
  }

  get pointsInfoDates() {
    const dateFrom = this.points[0]?.dateFrom || '';
    const dateTo = this.points[this.points.length - 1]?.dateTo || '';

    const startingDateTemplate = isDatesInOneMonth(dateFrom, dateTo)
      ? 'DD'
      : 'DD MMM';

    const startingDate = humanizeDateFormat(dateFrom, startingDateTemplate);
    const endingDate = humanizeDateFormat(dateTo, 'DD MMM');

    return `${startingDate} - ${endingDate}`;
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

  set points(points) {
    this.#points = points;
  }

  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }
    this.points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.points = [
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

    this.points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  }
}
