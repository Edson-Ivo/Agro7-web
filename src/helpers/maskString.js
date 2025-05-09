import extractNumbers from './extractNumbers';

const maskString = (value, pattern) => {
  if (value || (pattern === 'money' && value === 0)) {
    let i = 0;
    let pat = pattern;
    let v = value.toString();

    if (pat === 'phone') pat = '(##) #####-####';
    if (pat === 'postcode') pat = '#####-###';
    if (pat === 'document') {
      v = extractNumbers(v);

      if (v?.length <= 11) pat = '###.###.###-##';
      else pat = '##.###.###/####-##';
    }

    if (pat === 'area') return String(Number(v));
    if (pat === 'area-in-table') return String(Number(v)).replace('.', ',');

    if (pat === 'money')
      return Number(v)
        .toLocaleString('pt-br', {
          minimumFractionDigits: 2,
          style: 'currency',
          currency: 'BRL'
        })
        .toString();

    return pat.replace(/#/g, () => v[i++] || '');
  }

  return '';
};

export default maskString;
