export const greetings = () => {
  const tz = new Date().toLocaleString('en-US', {
    timeZone: 'America/Fortaleza'
  });

  const current = new Date(tz);
  const hours = current.getHours();
  let msg = '';

  if (hours < 12) {
    msg = 'Bom dia ';
  } else if (hours >= 12 && hours < 18) {
    msg = 'Boa tarde ';
  } else if (hours >= 18 && hours < 24) {
    msg = 'Boa noite ';
  }

  return msg;
};
