import moment from 'moment-timezone';
import 'moment/locale/pt-br';

const weekDayName = ['DOM.', 'SEG.', 'TER.', 'QUA.', 'QUI.', 'SEX.', 'SÁB.'];

export const getCurrentDate = date => moment(date).tz('America/Fortaleza');

export const weekDays = date => {
  const week = [];

  const current = getCurrentDate(date).startOf('day');

  for (let i = 0; i < 14; i += 1) {
    const isoString = dateToISOString(current);

    const dateObj = {
      date: current.format('DD'),
      dateString: isoString.split('T')[0],
      day: weekDayName[current.day()],
      string: isoString
    };

    week.push(dateObj);

    current.subtract(1, 'days');
  }

  return week;
};

export const dateConversor = (date, withTime = true) => {
  if (!date) return null;

  return getCurrentDate(date).format(`L${withTime ? ' LT' : ''}`);
};

export const dateToInput = date => getCurrentDate(date).format('YYYY-MM-DD');

export const dateToISOString = date => getCurrentDate(date).toISOString();

export const dateToISOStringFinish = date =>
  getCurrentDate(date).add(1, 'days').subtract(1, 'milliseconds').toISOString();

export const isValidDate = date => getCurrentDate(date).isValid();

export const removeTimeSeconds = time => {
  const timeToArray = String(time).split(':');

  if (timeToArray.length === 3) timeToArray.pop();

  return timeToArray.join(':');
};

export const getDateMonthInterval = (date, addFinalMonth = 0) => {
  const startOfMonth = getCurrentDate(date)
    .startOf('month')
    .subtract(1, 'days')
    .format('YYYY-MM-DD');

  const endOfMonth = getCurrentDate(date)
    .endOf('month')
    .add(addFinalMonth, 'months')
    .add(1, 'days')
    .format('YYYY-MM-DD');

  return [startOfMonth, endOfMonth];
};

export const getActualTwoWeekInterval = () => {
  const current = getCurrentDate().startOf('day');

  const startOfWeek = current.add(1, 'days').format('YYYY-MM-DD');

  const endOfWeek = current
    .subtract(2, 'weeks')
    .subtract(1, 'days')
    .format('YYYY-MM-DD');

  return [endOfWeek, startOfWeek];
};

export const addOneDay = date => getCurrentDate(date).add(1, 'days');
