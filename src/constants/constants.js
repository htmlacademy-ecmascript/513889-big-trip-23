const MSEC_IN_SEC = 1000;
const MSEC_IN_MIN = 60 * MSEC_IN_SEC;
export const MSEC_IN_HOUR = 60 * MSEC_IN_MIN;
export const MSEC_IN_DAY = 24 * MSEC_IN_HOUR;

export const DAY_MONTH_TEMPLATE = 'DD';
export const MONTH_TEMPLATE = 'MMM';
export const SHORT_DATE_TEMPLATE = `${DAY_MONTH_TEMPLATE} ${MONTH_TEMPLATE}`;
export const INVERTED_SHORT_DATE_TEMPLATE = `${MONTH_TEMPLATE} ${DAY_MONTH_TEMPLATE}`;
export const TIME_TEMPLATE = 'HH:mm';
export const LONG_EVENT_DURATION_TEMPLATE = 'DD[D] HH[H] mm[M]';
export const AVERAGE_EVENT_DURATION_TEMPLATE = 'HH[H] mm[M]';
export const SHORT_EVENT_DURATION_TEMPLATE = 'mm[M]';
export const DATE_EVENT_TEMPLATE = 'DD/MM/YY hh:mm';
export const MACHINE_DATE_TEMPLATE = 'YYYY-MM-DD';
export const FULL_MACHINE_DATE_TEMPLATE = `${MACHINE_DATE_TEMPLATE}[T]${TIME_TEMPLATE}`;
export const DATEPICKER_TEMPLATE = 'd/m/y H:i';

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

export const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export const AUTHORIZATION = 'Basic er883jdzbdwqwez';
export const END_POINT = 'https://23.objects.htmlacademy.pro/big-trip';
