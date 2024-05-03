import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const MSEC_IN_SEC = 1000;
const MSEC_IN_MIN = 60 * MSEC_IN_SEC;
const MSEC_IN_HOUR = 60 * MSEC_IN_MIN;
const MSEC_IN_DAY = 24 * MSEC_IN_HOUR;

const getDuration = (dateFrom, dateTo) => dayjs(dateTo).diff(dayjs(dateFrom));

const humanizeDateFormat = (date, format = 'MMM DD') => date ? dayjs(date).format(format) : '';

const humanizeDuration = (dateFrom, dateTo) => {
  const diff = getDuration(dateFrom, dateTo);

  if (diff >= MSEC_IN_DAY) {
    return dayjs.duration(diff).format('DD[D] HH[H] mm[M]');
  }

  if (diff >= MSEC_IN_HOUR) {
    return dayjs.duration(diff).format('HH[H] mm[M]');
  }

  return dayjs.duration(diff).format('mm[M]');
};

export {
  humanizeDateFormat,
  humanizeDuration,
};
