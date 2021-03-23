const weekDayName = ['DOM.', 'SEG.', 'TER.', 'QUA.', 'QUI.', 'SEX.', 'SÁB.'];

export const weekDays = () => {
  const week = [];
  const tz = new Date().toLocaleString('en-US', {
    timeZone: 'America/Fortaleza'
  });

  const current = new Date(tz);

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

export const dateConversor = date => {
  const tz = new Date(date).toLocaleString('pt-BR', {
    timeZone: 'America/Fortaleza'
  });

  return tz;
};
