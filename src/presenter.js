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
  filtersContainerEl = document.querySelector('#filters-container');
  sortContainerEl = document.querySelector('#sort-container');
  itemsContainerEl = document.querySelector('#items-container');
  infoContainerEl = document.querySelector('#info-container');

  init() {
    render(new FiltersView(), this.filtersContainerEl);
    render(new SortView(), this.sortContainerEl);
    render(new InfoMainView(), this.infoContainerEl);
    render(new InfoCostView(this.pointsModel.calculateTotalPrice), this.infoContainerEl);

    this.pointsModel.constructPointsList.forEach((item, i) => {
      render(new PointsView(item), this.itemsContainerEl);
      if(i === 0) {
        render(new EditView(), this.itemsContainerEl);
      }
    });
  }
}
