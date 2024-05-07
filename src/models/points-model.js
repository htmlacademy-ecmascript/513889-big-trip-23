import pointsMock from '../mocks/points-mock.json';
import offersMock from '../mocks/offers-mock.json';
import destinationsMock from '../mocks/destinations-mock.json';

export default class PointsModel {
  #pointsRaw = pointsMock;
  #offers = offersMock;
  #destinations = destinationsMock;
  #totalPrice = 0;

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
    });
  }

  get calculateTotalPrice() {
    this.constructPointsList.forEach(({offers}) => {
      offers.forEach(({price}) => {
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
}
