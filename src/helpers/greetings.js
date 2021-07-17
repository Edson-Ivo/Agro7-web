import { getCurrentDate } from './date';

export const greetings = () => {
  const current = getCurrentDate();
  const hours = current.format('HH');

  if (hours < 12) return 'Bom dia';
  if (hours >= 12 && hours < 18) return 'Boa tarde';
  return 'Boa noite';
};
