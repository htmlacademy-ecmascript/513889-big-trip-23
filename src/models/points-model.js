import {FilterType, UpdateType} from '../constants/constants';
import {humanizeDateFormat, isDatesInOneMonth, sortListByDate} from '../utils/common';
import Observable from '../framework/observable';

export default class PointsModel extends Observable{
  #pointsApiService = null;
  #points = null;
  #offers = null;
  #destinations = null;
  #filters = Object.values(FilterType);

  constructor(pointsApiService) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  async init() {
    try {
      await Promise.allSettled([
        this.#pointsApiService.points,
        this.#pointsApiService.destinations,
        this.#pointsApiService.offers
      ]).then((results) => {
        this.#points = results[0].status === 'fulfilled' ? results[0].value.map(this.#adaptToClient) : [];
        this.#destinations = results[1].status === 'fulfilled' ? results[1].value : [];
        this.#offers = results[2].status === 'fulfilled' ? results[2].value : [];
      });
    } catch(err) {
      this.#points = [];
      this.#destinations = [];
      this.#offers = [];
    }

    this._notify(UpdateType.INIT);
  }

  #adaptToClient(point) {
    const adaptedPoint = {...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
      dateTo: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
      isFavorite: point['is_favorite'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }

  get points() {
    return this.#points.map((item) => {
      const destination = this.#destinations ? this.#destinations.find(({id}) => id === item.destination) : {};
      const offersListByType = this.#offers ? this.#offers.find(({type}) => type === item.type) : [];
      const offers = offersListByType && offersListByType.offers?.filter(({id}) => item.offers.includes(id)) || [];

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

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#pointsApiService.updatePoints(update);
      const updatedPoint = this.#adaptToClient(response);
      this.points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error('Can\'t update point');
    }

    this._notify(updateType, update);
  }

  async addPoint(updateType, update) {
    try {
      const response = await this.#pointsApiService.addPoint(update);
      const newPoint = this.#adaptToClient(response);
      this.points = [newPoint, ...this.#points];
      this._notify(updateType, newPoint);
    } catch(err) {
      throw new Error('Can\'t add point');
    }
  }

  async deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#pointsApiService.deletePoint(update);
      this.points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete task');
    }
  }
}
