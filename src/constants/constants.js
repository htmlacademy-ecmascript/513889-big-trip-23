export const EVENT_TYPES = [
  'taxi', 'flight', 'drive', 'check-in', 'sightseeing', 'bus', 'train', 'restaurant', 'ship'
];

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

export const TripEmptyMessages = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no future events now',
};

export const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers',
};

export const Mode = {
  VIEW: 'VIEW',
  EDITING: 'EDITING',
};

export const DISABLED_SORT_TYPE = [SortType.EVENT, SortType.OFFERS];

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};

export const AUTHORIZATION = 'Basic er883jdzbdw';
export const END_POINT = 'https://23.objects.htmlacademy.pro/big-trip';
