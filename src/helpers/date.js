const weekDayName = ['DOM.', 'SEG.', 'TER.', 'QUA.', 'QUI.', 'SEX.', 'SÁB.'];

export const getTimezone = (date, local = 'en-US') => {
  const dateObj = date ? new Date(date) : new Date();

  return dateObj.toLocaleString(local, {
    timeZone: 'America/Fortaleza'
  });
};

export const getCurrentDate = date => {
  const tz = getTimezone(date);

  return new Date(tz);
};

export const weekDays = () => {
  const week = [];

  const current = getCurrentDate();

  for (let i = 0; i < 7; i += 1) {
    const date = {
      date: current.getDate(),
      day: weekDayName[current.getDay()]
    };

    week.push(date);

    current.setDate(current.getDate() - 1);
  }

  return week;
};

export const dateConversor = date => getTimezone(date, 'pt-BR');

export const dateToInput = date =>
  dateConversor(date).split(' ')[0].split('/').reverse().join('-');

export const dateToISOString = date => getCurrentDate(date).toISOString();
