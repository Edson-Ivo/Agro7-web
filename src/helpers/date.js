const weekDayName = ['DOM.', 'SEG.', 'TER.', 'QUA.', 'QUI.', 'SEX.', 'SÁB.'];

export const getTimezone = (date, local = 'en-US', withTime = true) => {
  const dateObj = date ? new Date(date) : new Date();
  const dateString = dateObj.toLocaleString(local, {
    timeZone: 'America/Fortaleza'
  });

  if (!withTime) dateObj.setHours(dateObj.getHours() - 3);

  return withTime ? dateString : dateString.split(' ')[0];
};

export const getCurrentDate = date => {
  const tz = getTimezone(date);

  return new Date(tz);
};

export const weekDays = date => {
  const week = [];

  const current = getCurrentDate(date);

  for (let i = 0; i < 14; i += 1) {
    const isoString = dateToISOString(current);

    const dateObj = {
      date: current.getDate(),
      dateString: isoString.split('T')[0],
      day: weekDayName[current.getDay()],
      string: isoString
    };

    week.push(dateObj);

    current.setDate(current.getDate() - 1);
  }

  return week;
};

export const dateConversor = (date, withTime = true) =>
  getTimezone(date, 'pt-BR', withTime);

export const dateToInput = date =>
  dateConversor(date).split(' ')[0].split('/').reverse().join('-');

export const dateToISOString = date => {
  const d = getCurrentDate(date);

  d.setUTCHours(3, 0, 0, 0);
  return d.toISOString();
};

export const isValidDate = date => {
  const d = getCurrentDate(date);

  return d instanceof Date && !Number.isNaN(d.getTime());
};
