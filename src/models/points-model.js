import pointsMock from '../mocks/points-mock.json';
import offersMock from '../mocks/offers-mock.json';
import destinationsMock from '../mocks/destinations-mock.json';
import {FilterTypes} from '../constants/constants';
import {sortListByDate} from '../utils/common';

export default class PointsModel {
  #pointsRaw = pointsMock;
  #offers = offersMock;
  #destinations = destinationsMock;
  #totalPrice = 0;
  #filters = Object.values(FilterTypes);

  get constructPointsList() {
    return this.#pointsRaw.map((item) => {
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
}
