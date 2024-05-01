import pointsMock from '../mocks/points-mock.json';
import offersMock from '../mocks/offers-mock.json';
import destinationsMock from '../mocks/destinations-mock.json';

// {
//   "id": "a9ce598d-ab9e-4d3d-8f52-10a4cfb90aa8",
//   "basePrice": 8328,
//   "dateFrom": "2024-06-18T21:35:08.027Z",
//   "dateTo": "2024-06-19T18:53:08.027Z",
//   "destination": {
//     "id": "ea54fb8f-9dfa-4ed4-886f-0c1b4376cc09",
//     "description": "Kioto - middle-eastern paradise",
//     "name": "Kioto",
//     "pictures": [
//       {
//         "src": "https://23.objects.htmlacademy.pro/static/destinations/5.jpg",
//         "description": "Kioto is a beautiful city"
//       },
//       {
//         "src": "https://23.objects.htmlacademy.pro/static/destinations/10.jpg",
//         "description": "Kioto with a beautiful old town"
//       },
//       {
//         "src": "https://23.objects.htmlacademy.pro/static/destinations/20.jpg",
//         "description": "Kioto with an embankment of a mighty river as a centre of attraction"
//       },
//       {
//         "src": "https://23.objects.htmlacademy.pro/static/destinations/2.jpg",
//         "description": "Kioto famous for its crowded street markets with the best street food in Asia"
//       },
//       {
//         "src": "https://23.objects.htmlacademy.pro/static/destinations/20.jpg",
//         "description": "Kioto a true asian pearl"
//       }
//     ]
//   },
//   "isFavorite": true,
//   "offers": [
//     {
//       "id": "36584776-4bbe-4d5e-92b7-b91a5db5dc21",
//       "title": "Upgrade to a business class",
//       "price": 147
//     },
//     {
//       "id": "d131fb1d-0a02-4f3a-bcec-99da5a96aace",
//       "title": "Choose the radio station",
//       "price": 185
//     },
//   ],
//   "type": "check-in"
// }

export default class PointsModel {
  pointsRaw = pointsMock;
  offers = offersMock;
  destinations = destinationsMock;
  totalPrice = 0;

  get constructPointsList() {
    return this.pointsRaw.map((item) => {
      const destination = this.destinations.find(({id}) => id === item.destination);
      const offersListByType = this.offers.find(({type}) => type === item.type);
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
        this.totalPrice += price;
      });
    });
    return this.totalPrice;
  }
}
