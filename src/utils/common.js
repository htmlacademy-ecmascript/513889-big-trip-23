import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {
  MSEC_IN_HOUR,
  MSEC_IN_DAY,
  INVERTED_SHORT_DATE_TEMPLATE,
  LONG_EVENT_DURATION_TEMPLATE,
  AVERAGE_EVENT_DURATION_TEMPLATE,
  SHORT_EVENT_DURATION_TEMPLATE,
  MONTH_TEMPLATE,
  DATE_EVENT_TEMPLATE
} from '../constants/constants';

dayjs.extend(duration);

export const getDuration = (dateFrom, dateTo) => dayjs(dateTo).diff(dayjs(dateFrom));

export const humanizeDateFormat = (date, format = INVERTED_SHORT_DATE_TEMPLATE) => date ? dayjs(date).format(format) : '';

export const humanizeDuration = (dateFrom, dateTo) => {
  const diff = getDuration(dateFrom, dateTo);

  if (diff >= MSEC_IN_DAY) {
    return dayjs.duration(diff).format(LONG_EVENT_DURATION_TEMPLATE);
  }

  if (diff >= MSEC_IN_HOUR) {
    return dayjs.duration(diff).format(AVERAGE_EVENT_DURATION_TEMPLATE);
  }

  return dayjs.duration(diff).format(SHORT_EVENT_DURATION_TEMPLATE);
};

export const isDatesInOneMonth = (dateA, dateB) => dayjs(dateA).format(MONTH_TEMPLATE) === dayjs(dateB).format(MONTH_TEMPLATE);

export const humanizeDateCalendarFormat = (date) => date ? dayjs(date).format(DATE_EVENT_TEMPLATE) : '';

export const isPointFuture = ({ dateFrom }) => dayjs().isBefore(dateFrom);

export const isPointPresent = ({ dateFrom, dateTo }) => dayjs().isAfter(dateFrom) && dayjs().isBefore(dateTo);

export const isPointPast = ({ dateTo }) => dayjs().isAfter(dateTo);

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

export const sortListByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

export const sortListByTime = (pointA, pointB) => {
  const weight = getWeightForNullDate(pointA.dateFrom, pointB.dateFrom);
  return weight ?? dayjs(pointB.dateFrom).diff(dayjs(pointA.dateFrom));
};
