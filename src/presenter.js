import FiltersView from './view/filters-view';
import SortView from './view/sort-view';
import PointsView from './view/points-view';
import InfoMainView from './view/info-main-view';
import InfoCostView from './view/info-cost-view';
import EditView from './view/edit-view';
import PointsModel from './models/points-model';
import {render} from './render';

export default class Presenter {
  pointsModel = new PointsModel();
  filtersContainerElement = document.querySelector('#filters-container');
  sortContainerElement = document.querySelector('#sort-container');
  itemsContainerElement = document.querySelector('#items-container');
  infoContainerElement = document.querySelector('#info-container');

  init() {
    render(new FiltersView(), this.filtersContainerElement);
    render(new SortView(), this.sortContainerElement);
    render(new InfoMainView(), this.infoContainerElement);
    render(new InfoCostView(this.pointsModel.calculateTotalPrice), this.infoContainerElement);

    this.pointsModel.constructPointsList.forEach((item, i) => {
      render(new PointsView(item), this.itemsContainerElement);
      if(i === 0) {
        render(new EditView(), this.itemsContainerElement);
      }
    });
  }
}
