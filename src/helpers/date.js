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

export const dateConversor = (date, withTime = true) =>
  getCurrentDate(date).format(`L${withTime ? ' LT' : ''}`);

export const dateToInput = date => getCurrentDate(date).format('YYYY-MM-DD');

export const dateToISOString = date => getCurrentDate(date).toISOString();

export const dateToISOStringFinish = date =>
  getCurrentDate(date).add(1, 'days').subtract(1, 'milliseconds').toISOString();

export const isValidDate = date => getCurrentDate(date).isValid();
