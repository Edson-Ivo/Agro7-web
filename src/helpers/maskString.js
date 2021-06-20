const maskString = (value, pattern) => {
  if (value) {
    let i = 0;
    let pat = pattern;
    const v = value.toString();

    if (pat === 'phone') pat = '(##) #####-####';

    return pat.replace(/#/g, () => v[i++] || '');
  }

  return '';
};

export default maskString;
