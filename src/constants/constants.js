export const EVENT_TYPES = [
  'taxi', 'flight', 'drive', 'check-in', 'sightseeing', 'bus', 'train', 'restaurant', 'ship'
];

export const FilterTypes = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

export const TripEmptyMessages = {
  [FilterTypes.EVERYTHING]: 'Click New Event to create your first point',
  [FilterTypes.FUTURE]: 'There are no past events now',
  [FilterTypes.PRESENT]: 'There are no present events now',
  [FilterTypes.PAST]: 'There are no future events now',
};