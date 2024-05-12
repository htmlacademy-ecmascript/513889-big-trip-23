import { FilterTypes } from '../constants/constants';
import { isPointFuture, isPointPresent, isPointPast } from './common';

const filter = {
  [FilterTypes.EVERYTHING]: (points) => [...points],
  [FilterTypes.FUTURE]: (points) => points.filter((point) => isPointFuture(point)),
  [FilterTypes.PRESENT]: (points) => points.filter((point) => isPointPresent(point)),
  [FilterTypes.PAST]: (points) => points.filter((point) => isPointPast(point)),
};

export const generateFilter = (points) => Object.entries(filter).map(([filterType, filterPoints]) => ({
  type: filterType,
  count: filterPoints(points).length,
}));
