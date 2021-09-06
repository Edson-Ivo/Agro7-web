import extractNumbers from './extractNumbers';

const maskString = (value, pattern) => {
  if (value) {
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

    return pat.replace(/#/g, () => v[i++] || '');
  }

  return '';
};

export default maskString;
