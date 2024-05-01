import FiltersView from './view/filters-view';
import SortView from './view/sort-view';
import ItemsView from './view/items-view';
import InfoMainView from './view/info-main-view';
import InfoCostView from './view/info-cost-view';
import EditView from './view/edit-view';
import {render} from './render';
import mock from './view/mock.json';

export default class Presenter {
  filters = new FiltersView();

  filtersContainer = document.querySelector('#filters-container');
  sortContainer = document.querySelector('#sort-container');
  itemsContainer = document.querySelector('#items-container');
  infoContainer = document.querySelector('#info-container');
  item = document.querySelector('.trip-events__item');

  init() {
    render(new FiltersView(), this.filtersContainer);
    render(new SortView(), this.sortContainer);
    render(new InfoMainView(), this.infoContainer);
    render(new InfoCostView(), this.infoContainer);

    mock.forEach((item, i) => {
      render(new ItemsView(item), this.itemsContainer);
      if(i === 0) {
        render(new EditView(), this.itemsContainer);
      }
    });
  }
}
