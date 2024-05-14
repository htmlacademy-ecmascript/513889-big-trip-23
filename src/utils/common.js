import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const MSEC_IN_SEC = 1000;
const MSEC_IN_MIN = 60 * MSEC_IN_SEC;
const MSEC_IN_HOUR = 60 * MSEC_IN_MIN;
const MSEC_IN_DAY = 24 * MSEC_IN_HOUR;

export const getDuration = (dateFrom, dateTo) => dayjs(dateTo).diff(dayjs(dateFrom));

export const humanizeDateFormat = (date, format = 'MMM DD') => date ? dayjs(date).format(format) : '';

export const humanizeDuration = (dateFrom, dateTo) => {
  const diff = getDuration(dateFrom, dateTo);

  if (diff >= MSEC_IN_DAY) {
    return dayjs.duration(diff).format('DD[D] HH[H] mm[M]');
  }

  if (diff >= MSEC_IN_HOUR) {
    return dayjs.duration(diff).format('HH[H] mm[M]');
  }

  return dayjs.duration(diff).format('mm[M]');
};

export const humanizeDateCalendarFormat = (date) => date ? dayjs(date).format('DD/MM/YY hh:mm') : '';

export const isPointFuture = ({ dateFrom }) => dayjs().isBefore(dateFrom);

export const isPointPresent = ({ dateFrom, dateTo }) => dayjs().isAfter(dateFrom) && dayjs().isBefore(dateTo);

export const isPointPast = ({ dateTo }) => dayjs().isAfter(dateTo);

export const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);

export const toCapitalize = (string) => `${string.charAt(0).toUpperCase()}${string.slice(1)}`;

export const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

export const sortListByDate = (pointA, pointB) => {
  const weight = getWeightForNullDate(pointA.dateTo, pointB.dateTo);
  return weight ?? dayjs(pointA.dateTo).diff(dayjs(pointB.dateTo));
};

export const sortListByEvent = (pointA, pointB) => pointB.destination.name - pointA.destination.name;

export const sortListByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

export const sortListByTime = (pointA, pointB) => {
  const weight = getWeightForNullDate(pointA.dateFrom, pointB.dateFrom);
  return weight ?? dayjs(pointB.dateFrom).diff(dayjs(pointA.dateFrom));
};
